<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $jobs = Job::active()
            ->when($request->search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->location, function($query, $location) {
                $query->where('location', 'like', "%{$location}%");
            })
            ->when($request->type, function($query, $type) {
                $query->where('job_type', $type);
            })
            ->latest()
            ->paginate(10);

        return view('jobs.index', compact('jobs'));
    }

    public function show(Job $job)
    {
        if ($job->isExpired()) {
            abort(404);
        }

        $hasApplied = false;
        
        if (Auth::check()) {
            $hasApplied = Application::where('job_id', $job->id)
                ->where('user_id', Auth::id())
                ->exists();
        }

        return view('jobs.show', compact('job', 'hasApplied'));
    }

    public function create()
    {
        $this->authorize('create', Job::class);
        
        return view('jobs.create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Job::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full-time,part-time,contract,internship',
            'experience_level' => 'required|in:entry,mid,senior,lead',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
        ]);

        $job = auth()->user()->company->jobs()->create($validated);

        return redirect()->route('jobs.show', $job)
            ->with('success', 'Job posted successfully!');
    }

    public function edit(Job $job)
    {
        $this->authorize('update', $job);
        
        return view('jobs.edit', compact('job'));
    }

    public function update(Request $request, Job $job)
    {
        $this->authorize('update', $job);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full-time,part-time,contract,internship',
            'experience_level' => 'required|in:entry,mid,senior,lead',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0',
        ]);

        $job->update($validated);

        return redirect()->route('jobs.show', $job)
            ->with('success', 'Job updated successfully!');
    }

    public function destroy(Job $job)
    {
        $this->authorize('delete', $job);
        
        $job->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Job deleted successfully!');
    }

    public function apply(Request $request, Job $job)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'cover_letter' => 'nullable|string|max:1000',
        ]);

        // Upload resume to Supabase Storage
        $path = $validated['resume']->store('resumes', 'supabase');

        Application::create([
            'job_id' => $job->id,
            'user_id' => Auth::id(),
            'resume_url' => $path,
            'cover_letter' => $validated['cover_letter'] ?? null,
        ]);

        return back()->with('success', 'Application submitted successfully!');
    }
}