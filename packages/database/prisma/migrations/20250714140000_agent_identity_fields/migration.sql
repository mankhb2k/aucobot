-- DropIndex
DROP INDEX IF EXISTS "agents_preset_id_key";

-- AlterTable
ALTER TABLE "agents"
  ADD COLUMN IF NOT EXISTS "avatar_url" TEXT,
  ADD COLUMN IF NOT EXISTS "bio" TEXT,
  ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "description" TEXT,
  ADD COLUMN IF NOT EXISTS "tone_preset" TEXT NOT NULL DEFAULT 'friendly',
  ADD COLUMN IF NOT EXISTS "tone_notes" TEXT,
  ADD COLUMN IF NOT EXISTS "enabled_skill_groups" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "instructions_source" JSONB;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "agents_preset_id_idx" ON "agents"("preset_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "agents_is_system_preset_id_idx" ON "agents"("is_system", "preset_id");
