ALTER TABLE `checkouts` DROP FOREIGN KEY `checkouts_book_id_books_book_id_fk`;
--> statement-breakpoint
ALTER TABLE `checkouts` DROP FOREIGN KEY `checkouts_user_id_users_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `checkouts` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `checkouts` MODIFY COLUMN `book_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `checkouts` MODIFY COLUMN `user_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `checkouts` MODIFY COLUMN `checkout_date` date;--> statement-breakpoint
ALTER TABLE `checkouts` MODIFY COLUMN `checkout_time` time;--> statement-breakpoint
ALTER TABLE `checkouts` ADD `return_date` date DEFAULT null;