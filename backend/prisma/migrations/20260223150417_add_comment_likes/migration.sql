-- AlterTable
ALTER TABLE "coach_post_comments" ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "coach_post_comment_likes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coach_post_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coach_post_comment_likes_commentId_userId_key" ON "coach_post_comment_likes"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "coach_post_comment_likes" ADD CONSTRAINT "coach_post_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "coach_post_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_post_comment_likes" ADD CONSTRAINT "coach_post_comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
