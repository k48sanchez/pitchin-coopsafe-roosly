-- Seed data, re-run on every `supabase db reset`.
insert into public.categories (name, icon)
values ('Streaming', 'tv'),
    ('Music', 'music'),
    ('Fitness', 'dumbbell'),
    ('News', 'newspaper'),
    ('Gaming', 'gamepad'),
    ('Cloud/Storage', 'cloud'),
    ('Productivity', 'briefcase'),
    ('Food/Delivery', 'utensils'),
    ('Other', 'ellipsis') on conflict (name) do nothing;