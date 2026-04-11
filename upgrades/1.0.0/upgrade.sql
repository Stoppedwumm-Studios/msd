-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Erstellungszeit: 11. Apr 2026 um 13:12
-- Server-Version: 10.11.14-MariaDB-ubu2204
-- PHP-Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Datenbank: `msd-app`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `config`
--

CREATE TABLE `config` (
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `dauerTermin`
--

CREATE TABLE `dauerTermin` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `messeId` int(11) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `einteilung`
--

CREATE TABLE `einteilung` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `geplanteMessenId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `fehlmessen`
--

CREATE TABLE `fehlmessen` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `messeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `geplanteMessen`
--

CREATE TABLE `geplanteMessen` (
  `id` int(11) NOT NULL,
  `messeId` int(11) NOT NULL,
  `tatsaechlichesDatum` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `messen`
--

CREATE TABLE `messen` (
  `id` int(11) NOT NULL,
  `uhrzeit` time NOT NULL,
  `wochentag` int(11) NOT NULL,
  `anzahl_messdiener` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `messen`
--

INSERT INTO `messen` (`id`, `uhrzeit`, `wochentag`, `anzahl_messdiener`) VALUES
(1, '18:30:00', 0, 2),
(2, '18:30:00', 2, 2),
(3, '18:30:00', 4, 2),
(4, '17:30:00', 5, 2),
(5, '09:30:00', 6, 2),
(6, '11:00:00', 6, 4);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `planLog`
--

CREATE TABLE `planLog` (
  `id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `start` date NOT NULL,
  `end` date NOT NULL,
  `genehmigt` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `termine`
--

CREATE TABLE `termine` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `start` date NOT NULL,
  `stop` date NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `passwort` text NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `einteilbar` tinyint(1) NOT NULL,
  `pater` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `name`, `passwort`, `admin`, `createdat`, `einteilbar`, `pater`) VALUES
(14, 'ALLE', 'i29eudj893ehf78h7fh7whhzuehhsiudhuhsuih7eg783g78rg37g378GZGZGTF%G§&G/§F%&/§EF%&\"D\"&F', 0, '2025-10-16 15:58:35', 0, 0),
(17, 'admin', 'root', 1, '2026-04-07 11:26:27', 0, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `vertretung`
--

CREATE TABLE `vertretung` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `resolved` tinyint(1) NOT NULL,
  `vertreter` int(11) DEFAULT NULL,
  `geplanteMessenId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `config`
--
ALTER TABLE `config`
  ADD UNIQUE KEY `config_key` (`key`);

--
-- Indizes für die Tabelle `dauerTermin`
--
ALTER TABLE `dauerTermin`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `einteilung`
--
ALTER TABLE `einteilung`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `fehlmessen`
--
ALTER TABLE `fehlmessen`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `geplanteMessen`
--
ALTER TABLE `geplanteMessen`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `messen`
--
ALTER TABLE `messen`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `planLog`
--
ALTER TABLE `planLog`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `termine`
--
ALTER TABLE `termine`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `vertretung`
--
ALTER TABLE `vertretung`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `dauerTermin`
--
ALTER TABLE `dauerTermin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `einteilung`
--
ALTER TABLE `einteilung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=829;

--
-- AUTO_INCREMENT für Tabelle `fehlmessen`
--
ALTER TABLE `fehlmessen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `geplanteMessen`
--
ALTER TABLE `geplanteMessen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=303;

--
-- AUTO_INCREMENT für Tabelle `messen`
--
ALTER TABLE `messen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `planLog`
--
ALTER TABLE `planLog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `termine`
--
ALTER TABLE `termine`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT für Tabelle `vertretung`
--
ALTER TABLE `vertretung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;
