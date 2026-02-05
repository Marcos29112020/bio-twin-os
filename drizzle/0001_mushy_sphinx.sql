CREATE TABLE `aiInsights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`energyLevel` int,
	`stressLevel` int,
	`healthScore` int,
	`analysis` text,
	`recommendations` text,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiInsights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dataType` varchar(50) NOT NULL,
	`value` text NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`source` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `healthData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `labResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`testName` varchar(255) NOT NULL,
	`results` text NOT NULL,
	`pdfUrl` varchar(500),
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `labResults_id` PRIMARY KEY(`id`)
);
