create table public.empathy_metrics (
    id bigint generated by default as identity primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metric_type text not null check (
        metric_type in (
            'good_deeds',
            'connecting_time'
        )
    ),
    value integer not null
);
-- Enable Row Level Security
alter table public.empathy_metrics enable row level security;
-- Create policy
create policy "Enable all operations for authenticated users" on public.empathy_metrics for all using (true) with check (true);
-- Strain Score Table
CREATE TABLE IF NOT EXISTS strain_score (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    score INTEGER NOT NULL CHECK (
        score >= 0
        AND score <= 21
    ),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(date)
);
-- Enable Row Level Security for strain_score
ALTER TABLE public.strain_score ENABLE ROW LEVEL SECURITY;
-- Create policy for strain_score
CREATE POLICY "Enable all operations for authenticated users" ON public.strain_score FOR ALL USING (true) WITH CHECK (true);
-- Create read_til_sleepy table
CREATE TABLE IF NOT EXISTS read_til_sleepy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
-- Enable RLS for read_til_sleepy
ALTER TABLE read_til_sleepy ENABLE ROW LEVEL SECURITY;
-- Create policy for read_til_sleepy
CREATE POLICY "Users can manage their own read_til_sleepy data" ON read_til_sleepy FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Create index for read_til_sleepy
CREATE INDEX IF NOT EXISTS read_til_sleepy_user_id_idx ON read_til_sleepy(user_id);
CREATE INDEX IF NOT EXISTS read_til_sleepy_created_at_idx ON read_til_sleepy(created_at);
-- Update base_metrics table constraint
ALTER TABLE base_metrics DROP CONSTRAINT IF EXISTS valid_metric_type;
ALTER TABLE base_metrics
ADD CONSTRAINT valid_metric_type CHECK (
        metric_type IN (
            'sleep_score',
            'strain_score',
            'sunlight',
            'plant_based',
            'reliability',
            'savings',
            'meditation',
            'walking',
            'jazz_abstinence',
            'yoga',
            'clean_space',
            'github_commits',
            'good_deeds',
            'connections',
            'read_til_sleepy'
        )
    );
-- Update valid_metric_values constraint
ALTER TABLE base_metrics DROP CONSTRAINT IF EXISTS valid_metric_values;
ALTER TABLE base_metrics
ADD CONSTRAINT valid_metric_values CHECK (
        (
            metric_type = 'sleep_score'
            AND value >= 0
            AND value <= 100
        )
        OR (
            metric_type = 'strain_score'
            AND value >= 0
            AND value <= 21
        )
        OR (
            metric_type = 'sunlight'
            AND value IN (0, 1)
        )
        OR (
            metric_type = 'plant_based'
            AND value >= 0
            AND value <= 100
        )
        OR (
            metric_type = 'reliability'
            AND value >= 0
            AND value <= 100
        )
        OR (
            metric_type = 'savings'
            AND value >= 0
        )
        OR (
            metric_type = 'meditation'
            AND value IN (0, 1)
        )
        OR (
            metric_type = 'walking'
            AND value IN (0, 1)
        )
        OR (
            metric_type = 'jazz_abstinence'
            AND value IN (0, 1)
        )
        OR (
            metric_type = 'yoga'
            AND value IN (0, 1)
        )
        OR (
            metric_type = 'clean_space'
            AND value IN (0, 1)
        )
        OR (
            metric_type = 'github_commits'
            AND value >= 0
        )
        OR (
            metric_type = 'good_deeds'
            AND value >= 0
        )
        OR (
            metric_type = 'connections'
            AND value >= 0
        )
        OR (
            metric_type = 'read_til_sleepy'
            AND value IN (0, 1)
        )
    );
-- AI Feedback table
create table ai_feedback (
    id uuid default uuid_generate_v4() primary key,
    message text not null,
    feedback_type text not null,
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Enable RLS
alter table ai_feedback enable row level security;
-- Create policy
create policy "Enable all operations for authenticated users" on ai_feedback for all using (true) with check (true);
-- Create indexes
create index idx_ai_feedback_created_at on ai_feedback(created_at);
create index idx_ai_feedback_type on ai_feedback(feedback_type);