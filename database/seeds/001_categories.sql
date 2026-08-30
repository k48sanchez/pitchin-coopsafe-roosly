-- Seed: subscription categories (milestone 2 reference data)
-- Idempotent: safe to run multiple times.
INSERT INTO categories (name, icon)
VALUES ('Streaming', 'tv'),
    ('Music', 'music'),
    ('Fitness', 'dumbbell'),
    ('News', 'newspaper'),
    ('Gaming', 'gamepad'),
    ('Cloud/Storage', 'cloud'),
    ('Productivity', 'briefcase'),
    ('Food/Delivery', 'utensils'),
    ('Other', 'ellipsis') ON CONFLICT (name) DO NOTHING;