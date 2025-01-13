-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2025. Jan 13. 05:59
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `project`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `answer`
--

CREATE TABLE `answer` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `answer_correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `answer`
--

INSERT INTO `answer` (`answer_id`, `question_id`, `answer`, `answer_correct`) VALUES
(1, 1, 'Józsi', 0),
(2, 1, 'Árpád', 1),
(3, 2, 'Józsi', 1),
(4, 2, 'Jani', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL COMMENT 'A kérdés sorszáma.',
  `quiz_id` varchar(16) NOT NULL COMMENT 'A quiz táblából a kulcs mező értéke. Ezzel lehet összekapcsolni a két táblát.',
  `question` text NOT NULL COMMENT 'Maga a kérdés.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `questions`
--

INSERT INTO `questions` (`question_id`, `quiz_id`, `question`) VALUES
(1, 'dada', 'Ki volt Árpád?\r\n'),
(2, 'dada', 'Ki volt Józsi?');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `quiz`
--

CREATE TABLE `quiz` (
  `quiz_id` varchar(16) NOT NULL COMMENT 'UUID alapján generált id',
  `quiz_title` varchar(255) NOT NULL COMMENT 'Ez a quiznek a címe lesz, pl.: "Fókák a tengerben".',
  `quiz_lang` varchar(3) NOT NULL COMMENT 'Itt a quiz-nek a nyelvezetét kell megjelölni, mint például: HU, EN, DE.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `quiz`
--

INSERT INTO `quiz` (`quiz_id`, `quiz_title`, `quiz_lang`) VALUES
('dada', 'Dada', 'HU');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- A tábla indexei `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- A tábla indexei `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`quiz_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `answer`
--
ALTER TABLE `answer`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A kérdés sorszáma.', AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `question_id` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`);

--
-- Megkötések a táblához `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
