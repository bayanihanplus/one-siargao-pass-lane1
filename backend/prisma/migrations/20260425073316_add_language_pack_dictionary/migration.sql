-- CreateTable
CREATE TABLE "LanguagePack" (
    "id" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "launchPriority" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LanguagePack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageTranslationKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'traveler',
    "defaultText" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LanguageTranslationKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageTranslationValue" (
    "id" TEXT NOT NULL,
    "languagePackId" TEXT NOT NULL,
    "translationKeyId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LanguageTranslationValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LanguagePack_languageCode_key" ON "LanguagePack"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageTranslationKey_key_key" ON "LanguageTranslationKey"("key");

-- CreateIndex
CREATE INDEX "LanguageTranslationValue_languagePackId_idx" ON "LanguageTranslationValue"("languagePackId");

-- CreateIndex
CREATE INDEX "LanguageTranslationValue_translationKeyId_idx" ON "LanguageTranslationValue"("translationKeyId");

-- CreateIndex
CREATE INDEX "LanguageTranslationValue_status_idx" ON "LanguageTranslationValue"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageTranslationValue_languagePackId_translationKeyId_key" ON "LanguageTranslationValue"("languagePackId", "translationKeyId");

-- AddForeignKey
ALTER TABLE "LanguageTranslationValue" ADD CONSTRAINT "LanguageTranslationValue_languagePackId_fkey" FOREIGN KEY ("languagePackId") REFERENCES "LanguagePack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageTranslationValue" ADD CONSTRAINT "LanguageTranslationValue_translationKeyId_fkey" FOREIGN KEY ("translationKeyId") REFERENCES "LanguageTranslationKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
