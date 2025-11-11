-- --------------------------------------------------------
-- Database initialization for novel_app
-- --------------------------------------------------------

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- --------------------------------------------------------
-- Table: novel_table
-- --------------------------------------------------------

CREATE TABLE `novel_table` (
                               `id` int(11) NOT NULL AUTO_INCREMENT,
                               `name` varchar(255) DEFAULT NULL,
                               `formatted_name` varchar(255) DEFAULT NULL,
                               `chapter_count` int(11) DEFAULT NULL,
                               `status` varchar(20) DEFAULT NULL,
                               `latest_update` varchar(255) DEFAULT NULL,
                               `image_url` varchar(255) DEFAULT NULL,
                               `source` varchar(50) DEFAULT NULL,
                               `last_synced_at` datetime DEFAULT NULL,
                               PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------

CREATE TABLE `users` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `username` varchar(255) NOT NULL,
                         `password` varchar(255) DEFAULT NULL,
                         `normal_general_template_id` int(11) DEFAULT NULL,
                         `small_general_template_id` int(11) DEFAULT NULL,
                         `created_at` datetime DEFAULT NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: templates
-- --------------------------------------------------------

CREATE TABLE `templates` (
                             `id` int(11) NOT NULL AUTO_INCREMENT,
                             `user_id` int(11) DEFAULT NULL,
                             `type` enum('general','reader') NOT NULL,
                             `name` varchar(255) NOT NULL,
                             `customization` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customization`)),
                             PRIMARY KEY (`id`),
                             KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: user_novel
-- --------------------------------------------------------

CREATE TABLE `user_novel` (
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `user_id` int(11) DEFAULT NULL,
                              `novel_id` int(11) DEFAULT NULL,
                              `current_chapter` int(11) DEFAULT NULL,
                              `read_chapters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`read_chapters`)),
                              `image_url_alternative` varchar(255) DEFAULT NULL,
                              `name_alternative` varchar(255) DEFAULT NULL,
                              `last_read` datetime DEFAULT NULL,
                              `normal_template_id` int(11) DEFAULT NULL,
                              `small_template_id` int(11) DEFAULT NULL,
                              PRIMARY KEY (`id`),
                              KEY `user_id` (`user_id`),
                              KEY `novel_id` (`novel_id`),
                              KEY `normal_template` (`normal_template_id`),
                              KEY `small_template` (`small_template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table constraints
-- --------------------------------------------------------

-- Templates foreign key to users
ALTER TABLE `templates`
    ADD CONSTRAINT `templates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

-- Users foreign keys to templates
ALTER TABLE `users`
    ADD KEY `normal_general_template_id` (`normal_general_template_id`),
    ADD KEY `small_general_template_id` (`small_general_template_id`),
    ADD CONSTRAINT `normal_general_template_id` FOREIGN KEY (`normal_general_template_id`) REFERENCES `templates` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `small_general_template_id` FOREIGN KEY (`small_general_template_id`) REFERENCES `templates` (`id`) ON DELETE SET NULL;

-- User_novel foreign keys
ALTER TABLE `user_novel`
    ADD CONSTRAINT `user_novel_ibfk_1` FOREIGN KEY (`novel_id`) REFERENCES `novel_table` (`id`),
    ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    ADD CONSTRAINT `normal_template` FOREIGN KEY (`normal_template_id`) REFERENCES `templates` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `small_template` FOREIGN KEY (`small_template_id`) REFERENCES `templates` (`id`) ON DELETE SET NULL;

-- --------------------------------------------------------
-- Default template inserts
-- --------------------------------------------------------

INSERT INTO `templates` (`id`, `user_id`, `type`, `name`, `customization`) VALUES
                                                                               (1, NULL, 'reader', 'normal-default-reader', '{\n  \"text\": {\n    \"family\": \"Inter\",\n    \"size\": \"18px\",\n    \"weight\": \"normal\",\n    \"outline\": \"none\",\n    \"outline_color\": \"#000000\",\n    \"separator_width\": \"2px\",\n    \"separator_color\": \"#99a1af\"\n  },\n  \"title\": {\n    \"family\": \"Inter\",\n    \"size\": \"30px\",\n    \"weight\": \"bold\",\n    \"outline\": \"none\",\n    \"outline_color\": \"#000000\"\n  },\n  \"chapter_title_color\": \"#5e42fc\",\n  \"chapter_content_color\": \"#fafafa\",\n  \"text_spacing\": {\n    \"block_spacing\": \"16px\",\n    \"word_spacing\": \"normal\",\n    \"letter_spacing\": \"normal\",\n    \"line_height\": \"28px\"\n  },\n  \"title_spacing\": {\n    \"word_spacing\": \"normal\",\n    \"letter_spacing\": \"normal\",\n    \"line_height\": \"36px\"\n  },\n  \"background\": {\n    \"image\": \"none\",\n    \"color\": \"#171717\",\n    \"size\": \"cover\",\n    \"position\": \"center\",\n    \"attachment\": \"fixed\",\n    \"repeat\": \"no-repeat\"\n  },\n  \"menu\": {\n    \"navbar_hidden\": false,\n    \"nav_color\": \"#121212\",\n    \"text_color\": \"#fafafa\",\n    \"outline_color\": \"#5e42cf\",\n    \"navigation_buttons\": {\n      \"icon_size\": \"1.5rem\",\n      \"icon_color\": \"#fafafa\",\n      \"icon_stroke_size\": 4,\n      \"background_color\": \"#0c0c0c\",\n      \"background_color_hover\": \"#5e42cf\",\n      \"border_width\": \"4px\",\n      \"border_color\": \"#5e42cf\",\n      \"border_radius\": \"99px\",\n      \"padding\": \"12px\",\n      \"progress_bar_thickness\": 8\n    }\n  },\n  \"infinite_scrolling\": false,\n  \"horizontal_reading\": false\n}'),
                                                                               (2, NULL, 'reader', 'small-default-reader', '{\n  \"text\": {\n    \"family\": \"Inter\",\n    \"size\": \"16px\",\n    \"weight\": \"normal\",\n    \"outline\": \"none\",\n    \"outline_color\": \"#000000\",\n    \"separator_width\": \"2px\",\n    \"separator_color\": \"#99a1af\"\n  },\n  \"title\": {\n    \"family\": \"Inter\",\n    \"size\": \"24px\",\n    \"weight\": \"bold\",\n    \"outline\": \"none\",\n    \"outline_color\": \"#000000\"\n  },\n  \"chapter_title_color\": \"#5e42fc\",\n  \"chapter_content_color\": \"#fafafa\",\n  \"text_spacing\": {\n    \"block_spacing\": \"16px\",\n    \"word_spacing\": \"normal\",\n    \"letter_spacing\": \"normal\",\n    \"line_height\": \"24px\"\n  },\n  \"title_spacing\": {\n    \"word_spacing\": \"normal\",\n    \"letter_spacing\": \"normal\",\n    \"line_height\": \"32px\"\n  },\n  \"background\": {\n    \"image\": \"none\",\n    \"color\": \"#171717\",\n    \"size\": \"cover\",\n    \"position\": \"center\",\n    \"attachment\": \"fixed\",\n    \"repeat\": \"no-repeat\"\n  },\n  \"menu\": {\n    \"navbar_hidden\": true,\n    \"nav_color\": \"#121212\",\n    \"text_color\": \"#fafafa\",\n    \"outline_color\": \"#5e42cf\",\n    \"navigation_buttons\": {\n      \"icon_size\": \"1rem\",\n      \"icon_color\": \"#fafafa\",\n      \"icon_stroke_size\": 4,\n      \"background_color\": \"#0c0c0c\",\n      \"background_color_hover\": \"#5e42cf\",\n      \"border_width\": \"2px\",\n      \"border_color\": \"#5e42cf\",\n      \"border_radius\": \"99px\",\n      \"padding\": \"10px\",\n      \"progress_bar_thickness\": 8\n    }\n  },\n  \"infinite_scrolling\": false,\n  \"horizontal_reading\": false\n}'),
                                                                               (3, NULL, 'general', 'default-general', '{\n  \"background\": {\n    \"image\": \"/background_img.png\",\n    \"color\": \"#000000\",\n    \"size\": \"cover\",\n    \"position\": \"center\",\n    \"attachment\": \"fixed\",\n    \"repeat\": \"no-repeat\"\n  },\n  \"menu\": {\n    \"nav_color\": \"#121212\",\n    \"text_color\": \"#fafafa\",\n    \"outline_color\": \"#5e42cf\"\n  }\n}');

COMMIT;