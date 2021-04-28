-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "compound_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider_type" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "access_token_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "profile_image" TEXT,
    "background_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hashtag" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tweet" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tweet_comment" (
    "id" SERIAL NOT NULL,
    "tweet_id" INTEGER NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tweet_image" (
    "id" SERIAL NOT NULL,
    "tweet_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_follows" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_retweet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_comment_likes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_tweet_likes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_tweet_saves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_hashtags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts.compound_id_unique" ON "accounts"("compound_id");

-- CreateIndex
CREATE INDEX "providerAccountId" ON "accounts"("provider_account_id");

-- CreateIndex
CREATE INDEX "providerId" ON "accounts"("provider_id");

-- CreateIndex
CREATE INDEX "userId" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions.session_token_unique" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions.access_token_unique" ON "sessions"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests.token_unique" ON "verification_requests"("token");

-- CreateIndex
CREATE UNIQUE INDEX "profile.username_unique" ON "profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "profile.email_unique" ON "profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hashtag.content_unique" ON "hashtag"("content");

-- CreateIndex
CREATE UNIQUE INDEX "_follows_AB_unique" ON "_follows"("A", "B");

-- CreateIndex
CREATE INDEX "_follows_B_index" ON "_follows"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_retweet_AB_unique" ON "_retweet"("A", "B");

-- CreateIndex
CREATE INDEX "_retweet_B_index" ON "_retweet"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_comment_likes_AB_unique" ON "_comment_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_comment_likes_B_index" ON "_comment_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_tweet_likes_AB_unique" ON "_tweet_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_tweet_likes_B_index" ON "_tweet_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_tweet_saves_AB_unique" ON "_tweet_saves"("A", "B");

-- CreateIndex
CREATE INDEX "_tweet_saves_B_index" ON "_tweet_saves"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_hashtags_AB_unique" ON "_hashtags"("A", "B");

-- CreateIndex
CREATE INDEX "_hashtags_B_index" ON "_hashtags"("B");

-- AddForeignKey
ALTER TABLE "tweet" ADD FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tweet_comment" ADD FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tweet_comment" ADD FOREIGN KEY ("tweet_id") REFERENCES "tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tweet_image" ADD FOREIGN KEY ("tweet_id") REFERENCES "tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_follows" ADD FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_follows" ADD FOREIGN KEY ("B") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_retweet" ADD FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_retweet" ADD FOREIGN KEY ("B") REFERENCES "tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comment_likes" ADD FOREIGN KEY ("A") REFERENCES "tweet_comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comment_likes" ADD FOREIGN KEY ("B") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tweet_likes" ADD FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tweet_likes" ADD FOREIGN KEY ("B") REFERENCES "tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tweet_saves" ADD FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tweet_saves" ADD FOREIGN KEY ("B") REFERENCES "tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hashtags" ADD FOREIGN KEY ("A") REFERENCES "hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hashtags" ADD FOREIGN KEY ("B") REFERENCES "tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
