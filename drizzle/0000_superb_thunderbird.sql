CREATE TABLE `books` (
	`book_id` varchar(40) NOT NULL,
	`name` varchar(100) NOT NULL,
	`author` varchar(100) NOT NULL,
	`genre` varchar(100) NOT NULL,
	`total_copies` int NOT NULL,
	`available_copies` int NOT NULL,
	CONSTRAINT `books_book_id` PRIMARY KEY(`book_id`)
);
--> statement-breakpoint
CREATE TABLE `checkins` (
	`id` varchar(40) NOT NULL,
	`book_id` varchar(40),
	`user_id` varchar(40),
	`quantity` int NOT NULL,
	`notes` varchar(255),
	`checkin_date` timestamp NOT NULL,
	`checkin_time` timestamp NOT NULL,
	CONSTRAINT `checkins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checkouts` (
	`id` varchar(40) NOT NULL,
	`book_id` varchar(40),
	`user_id` varchar(40),
	`checkout_date` timestamp NOT NULL,
	`checkout_time` timestamp NOT NULL,
	CONSTRAINT `checkouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` varchar(40) NOT NULL,
	`name` varchar(100) NOT NULL,
	`user_type` varchar(10) NOT NULL,
	`password` varchar(100) NOT NULL,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `checkins` ADD CONSTRAINT `checkins_book_id_books_book_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `checkins` ADD CONSTRAINT `checkins_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `checkouts` ADD CONSTRAINT `checkouts_book_id_books_book_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `checkouts` ADD CONSTRAINT `checkouts_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;