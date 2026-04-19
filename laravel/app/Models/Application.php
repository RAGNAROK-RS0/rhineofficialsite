<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'user_id',
        'resume_url',
        'cover_letter',
        'status',
        'notes',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_REVIEWING = 'reviewing';
    const STATUS_SHORTLISTED = 'shortlisted';
    const STATUS_REJECTED = 'rejected';
    const STATUS_HIRED = 'hired';

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'reviewing' => 'blue',
            'shortlisted' => 'green',
            'rejected' => 'red',
            'hired' => 'purple',
            default => 'gray',
        };
    }
}