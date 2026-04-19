<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'logo_url',
        'website',
        'location',
        'size',
        'industry',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    public function activeJobs()
    {
        return $this->jobs()->active();
    }

    public function hasLogo(): bool
    {
        return !empty($this->logo_url);
    }
}