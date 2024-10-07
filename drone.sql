-- MySQL dump 10.19  Distrib 10.3.37-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: drone
-- ------------------------------------------------------
-- Server version	10.3.37-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bank_list`
--

DROP TABLE IF EXISTS `bank_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bank_list` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `main_cd` varchar(20) NOT NULL DEFAULT 'BL' COMMENT '메인 코드',
  `bl_seq` varchar(20) NOT NULL DEFAULT '01' COMMENT '계좌 코드순번',
  `bl_uc` varchar(20) NOT NULL COMMENT '계좌 고유 코드(공장코드-메인코드-계좌 코드순번 조합)',
  `bl_cd` varchar(20) NOT NULL DEFAULT 'BL10' COMMENT '계좌 코드',
  `bl_gb` enum('A','B','C') NOT NULL DEFAULT 'A' COMMENT '계좌 유형 (A: 법인, B: 개인사업자, C: 개인)',
  `bl_no` varchar(10) NOT NULL DEFAULT '' COMMENT '계좌 정렬순서',
  `top_gb` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '대표 은행 계좌',
  `holder_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '예금주',
  `bl_nm` varchar(5) NOT NULL DEFAULT '' COMMENT '은행코드 (AC / 030)',
  `bl_num` varchar(100) NOT NULL DEFAULT '' COMMENT '계좌번호',
  `off_nm` varchar(100) NOT NULL DEFAULT '' COMMENT '지점명',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_bl_seq` (`local_cd`,`main_cd`,`bl_seq`) USING BTREE,
  UNIQUE KEY `bl_uc` (`bl_uc`) USING BTREE,
  UNIQUE KEY `local_cd_bl_nm_bl_num` (`local_cd`,`bl_nm`,`bl_num`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장 은행 계좌 관리 테이블 (사용안함 - 사용시에 재검토 예정)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_list`
--

LOCK TABLES `bank_list` WRITE;
/*!40000 ALTER TABLE `bank_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `bank_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_addr`
--

DROP TABLE IF EXISTS `biz_addr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `biz_addr` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_allips.factory)',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 고유 코드',
  `ba_seq` varchar(50) DEFAULT '01' COMMENT '배송지 코드순번',
  `ba_gb` varchar(5) DEFAULT '' COMMENT '배송 구분(DI/010)',
  `ba_nm` varchar(20) DEFAULT '' COMMENT '배송지 명',
  `ba_zip` varchar(50) DEFAULT '' COMMENT '우편번호',
  `ba_addr` varchar(255) DEFAULT '' COMMENT '배송지 주소',
  `ba_detail` varchar(255) DEFAULT '' COMMENT '배송지 상세주소',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `etc_4` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조4',
  `etc_5` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조5',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일자',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일자',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_cust_cd_ba_seq` (`local_cd`,`cust_cd`,`ba_seq`),
  KEY `FK_biz_addr_biz_list` (`cust_cd`),
  CONSTRAINT `FK_biz_addr_biz_list` FOREIGN KEY (`cust_cd`) REFERENCES `biz_list` (`cust_cd`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='공장 거래처 별 배송지 관리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_addr`
--

LOCK TABLES `biz_addr` WRITE;
/*!40000 ALTER TABLE `biz_addr` DISABLE KEYS */;
/*!40000 ALTER TABLE `biz_addr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_file`
--

DROP TABLE IF EXISTS `biz_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `biz_file` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 코드',
  `file_seq` varchar(50) NOT NULL DEFAULT '01' COMMENT '파일 순번',
  `file_dseq` varchar(50) NOT NULL DEFAULT '1' COMMENT '파일 상세순번',
  `file_orig` varchar(50) NOT NULL DEFAULT '' COMMENT '원본 파일 명',
  `file_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '신규 파일 명',
  `file_path` varchar(255) NOT NULL DEFAULT '' COMMENT '파일 경로(URL)',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_cust_cd_file_seq_file_dseq` (`local_cd`,`cust_cd`,`file_seq`,`file_dseq`),
  KEY `FK_biz_file_biz_list` (`cust_cd`),
  CONSTRAINT `FK_biz_file_biz_list` FOREIGN KEY (`cust_cd`) REFERENCES `biz_list` (`cust_cd`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='거래처 별 파일 관리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_file`
--

LOCK TABLES `biz_file` WRITE;
/*!40000 ALTER TABLE `biz_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `biz_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_list`
--

DROP TABLE IF EXISTS `biz_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `biz_list` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_allips.factory)',
  `main_cd` varchar(1) NOT NULL DEFAULT 'C' COMMENT '메인 코드',
  `biz_seq` varchar(20) NOT NULL DEFAULT '00001' COMMENT '거래처 코드순번',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 고유 코드(공장코드+C+코드순번)',
  `cust_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '거래처(별칭) 명',
  `biz_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '사업장(고객) 명',
  `cust_gb` varchar(5) NOT NULL DEFAULT '001' COMMENT '업체 구분 (BU/160)',
  `biz_num` varchar(50) NOT NULL DEFAULT '' COMMENT '사업자 등록번호',
  `cust_num` varchar(50) NOT NULL DEFAULT '' COMMENT '주민번호',
  `ceo_nm` varchar(50) DEFAULT '' COMMENT '대표자 명',
  `ceo_tel` varchar(50) DEFAULT '' COMMENT '대표자 연락처',
  `cust_grade` varchar(5) DEFAULT 'amt1' COMMENT '거래처 등급 (factory_amt_nm 컬럼명)',
  `dlv_gb` varchar(5) DEFAULT '001' COMMENT '배송구분 (DI/010)',
  `biz_class` varchar(20) DEFAULT '' COMMENT '업태',
  `biz_type` varchar(20) DEFAULT '' COMMENT '종목',
  `tel` varchar(50) DEFAULT '' COMMENT '전화번호',
  `fax` varchar(50) DEFAULT '' COMMENT '팩스번호',
  `email` varchar(100) DEFAULT '' COMMENT '이메일주소',
  `biz_zip` varchar(50) DEFAULT '' COMMENT '우편번호',
  `address` varchar(255) DEFAULT '' COMMENT '주소',
  `addr_detail` varchar(255) DEFAULT '' COMMENT '상세주소',
  `person` varchar(50) DEFAULT '' COMMENT '담당자 명',
  `person_tel` varchar(50) DEFAULT '' COMMENT '담당자 연락처',
  `holder_nm` varchar(50) DEFAULT '' COMMENT '예금주',
  `bl_nm` varchar(20) DEFAULT '' COMMENT '은행코드 (AC/030)',
  `bl_num` varchar(100) DEFAULT '' COMMENT '계좌번호',
  `sales_person` varchar(50) DEFAULT '' COMMENT '영업담당자 (z_plan.user_list.ikey)',
  `vat` enum('Y','N','S') NOT NULL DEFAULT 'N' COMMENT '부가세 여부 (N: 과세, Y: 면세, S: 영세)',
  `dlv_zip` varchar(100) NOT NULL DEFAULT '' COMMENT '배송지 우편번호',
  `dlv_addr` varchar(255) NOT NULL DEFAULT '' COMMENT '배송지 주소',
  `dlv_detail` varchar(255) NOT NULL DEFAULT '' COMMENT '배송지 상세주소',
  `memo` longtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일자',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일자',
  PRIMARY KEY (`ikey`),
  UNIQUE KEY `cust_cd` (`cust_cd`),
  UNIQUE KEY `local_cd_main_cd_biz_seq` (`local_cd`,`main_cd`,`biz_seq`) USING BTREE,
  KEY `cust_nm` (`cust_nm`),
  KEY `biz_nm` (`biz_nm`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장별 거래처 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_list`
--

LOCK TABLES `biz_list` WRITE;
/*!40000 ALTER TABLE `biz_list` DISABLE KEYS */;
INSERT INTO `biz_list` VALUES (74,'KR13','C','00001','KR13C00001','현대 일렉트릭','현대 일렉트릭','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:13:26','152','211.54.148.249','2023-12-22 13:17:12'),(75,'KR13','C','00002','KR13C00002','C2O','C2O','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:13:29','152','1.215.144.226','2022-11-04 13:25:48'),(76,'KR13','C','00003','KR13C00003','원프라스틱(주)','원프라스틱(주)','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:13:34','152','1.215.144.226','2022-11-04 13:26:02'),(77,'KR13','C','00004','KR13C00004','(주)미래에스비','(주)미래에스비','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:13:38','152','1.215.144.226','2022-11-04 13:26:12'),(78,'KR13','C','00005','KR13C00005','(주)어나더데이','(주)어나더데이','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:13:42','152','1.215.144.226','2022-11-04 13:26:26'),(79,'KR13','C','00006','KR13C00006','(주)커넥터','(주)커넥터','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:13:48','152','1.215.144.226','2022-11-04 13:26:56'),(80,'KR13','C','00007','KR13C00007','(주)TJ에어로시스템즈','(주)TJ에어로시스템즈','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:13:52','152','1.215.144.226','2022-11-04 13:27:26'),(81,'KR13','C','00008','KR13C00008','(주)TJ에어로시스템즈','(주)TJ에어로시스템즈','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:13:57','152','1.215.144.226','2022-11-11 09:29:00'),(82,'KR13','C','00009','KR13C00009','(주)다솔낚시마트','(주)다솔낚시마트','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:14:01','152','121.156.13.66','2022-12-01 18:46:27'),(83,'KR13','C','00010','KR13C00010','(주)상영마그네트','(주)상영마그네트','001','','','','','','002','','','','','','','','','','','','','','','N','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:14:05','152','1.215.144.226','2022-11-04 13:28:02');
/*!40000 ALTER TABLE `biz_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bom_detail`
--

DROP TABLE IF EXISTS `bom_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bom_detail` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (factory.local_cd)',
  `bom_uc` varchar(20) NOT NULL COMMENT 'BOM 코드 (bom_master.bom_uc)',
  `pp_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '공정 코드 (prod_proc.pp_uc)',
  `pp_nm` varchar(255) NOT NULL DEFAULT '' COMMENT '공정 명',
  `item_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '품목 코드 (item_list.item_cd)',
  `spec` longtext NOT NULL DEFAULT '' COMMENT '(제품스펙[JSON])',
  `usage` float NOT NULL DEFAULT 0 COMMENT '자재 소요량',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / 사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  KEY `FK_bom_detail_bom_master` (`bom_uc`),
  CONSTRAINT `FK_bom_detail_bom_master` FOREIGN KEY (`bom_uc`) REFERENCES `bom_master` (`bom_uc`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='BOM 관리 상세 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bom_detail`
--

LOCK TABLES `bom_detail` WRITE;
/*!40000 ALTER TABLE `bom_detail` DISABLE KEYS */;
INSERT INTO `bom_detail` VALUES (113,'KR13','KR13-BOM-01','KR13-PP-01','제작','KR13B00001','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:42:29','','',NULL),(114,'KR13','KR13-BOM-02','KR13-PP-01','제작','KR13B00005','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:12','','',NULL),(115,'KR13','KR13-BOM-03','KR13-PP-01','제작','KR13B00008','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:20','','',NULL),(116,'KR13','KR13-BOM-04','KR13-PP-01','제작','KR13B00010','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:29','','',NULL),(117,'KR13','KR13-BOM-05','KR13-PP-01','제작','KR13B00006','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:40','','',NULL),(118,'KR13','KR13-BOM-06','KR13-PP-01','제작','KR13B00007','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:48','','',NULL),(119,'KR13','KR13-BOM-07','KR13-PP-01','제작','KR13B00003','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:58','','',NULL),(120,'KR13','KR13-BOM-08','KR13-PP-01','제작','KR13B00009','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:08','','',NULL),(121,'KR13','KR13-BOM-09','KR13-PP-01','제작','KR13B00002','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:17','','',NULL),(122,'KR13','KR13-BOM-10','KR13-PP-01','제작','KR13B00013','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:28','','',NULL),(123,'KR13','KR13-BOM-11','KR13-PP-01','제작','KR13B00004','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:38','','',NULL),(124,'KR13','KR13-BOM-12','KR13-PP-01','제작','KR13B00011','',1,'','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:47','','',NULL),(125,'KR13','KR13-BOM-13','KR13-PP-02','드론 제조','KR13B00001','',1,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 14:18:47','','',NULL),(126,'KR13','KR13-BOM-14','KR13-PP-02','드론 제조','KR13B00001','',1,'','N','Y','N','','','','152','211.54.148.249','2023-12-18 17:06:29','','',NULL),(127,'KR13','KR13-BOM-15','KR13-PP-02','드론 제조','KR13B00015','',1,'','N','Y','N','','','','152','211.54.148.249','2023-12-19 17:31:41','','',NULL),(128,'KR13','KR13-BOM-16','KR13-PP-03','드론 제조 12/22','KR13B00016','',1,'','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:16:36','','',NULL);
/*!40000 ALTER TABLE `bom_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bom_master`
--

DROP TABLE IF EXISTS `bom_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bom_master` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (factory.local_cd)',
  `main_cd` varchar(20) NOT NULL DEFAULT 'BOM' COMMENT '메인 코드',
  `bom_seq` varchar(20) NOT NULL DEFAULT '01' COMMENT 'BOM 코드순번',
  `bom_uc` varchar(20) NOT NULL COMMENT 'BOM 고유 코드 (공장코드-메인코드-BOM 코드순번 조합)',
  `pc_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '라우팅 코드',
  `item_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '제품 코드 (item_list.item_cd)',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / 사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_bom_seq` (`local_cd`,`main_cd`,`bom_seq`),
  UNIQUE KEY `bom_uc` (`bom_uc`),
  UNIQUE KEY `local_cd_item_cd` (`local_cd`,`item_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='BOM 관리 마스터 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bom_master`
--

LOCK TABLES `bom_master` WRITE;
/*!40000 ALTER TABLE `bom_master` DISABLE KEYS */;
INSERT INTO `bom_master` VALUES (89,'KR13','BOM','01','KR13-BOM-01','KR13-PC-01','KR13S00001','','Y','Y','N','','','','152','1.215.144.226','2022-11-11 09:42:29','152','1.215.144.226','2022-11-11 09:43:37'),(90,'KR13','BOM','02','KR13-BOM-02','KR13-PC-01','KR13S00005','','Y','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:12','152','211.54.148.249','2023-12-14 10:24:48'),(91,'KR13','BOM','03','KR13-BOM-03','KR13-PC-01','KR13S00008','','Y','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:20','152','211.54.148.249','2023-12-13 18:50:59'),(92,'KR13','BOM','04','KR13-BOM-04','KR13-PC-01','KR13S00010','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:29','','',NULL),(93,'KR13','BOM','05','KR13-BOM-05','KR13-PC-01','KR13S00006','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:40','','',NULL),(94,'KR13','BOM','06','KR13-BOM-06','KR13-PC-01','KR13S00007','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:48','','',NULL),(95,'KR13','BOM','07','KR13-BOM-07','KR13-PC-01','KR13S00003','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:53:58','','',NULL),(96,'KR13','BOM','08','KR13-BOM-08','KR13-PC-01','KR13S00009','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:08','','',NULL),(97,'KR13','BOM','09','KR13-BOM-09','KR13-PC-01','KR13S00002','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:17','','',NULL),(98,'KR13','BOM','10','KR13-BOM-10','KR13-PC-01','KR13S00013','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:28','','',NULL),(99,'KR13','BOM','11','KR13-BOM-11','KR13-PC-01','KR13S00004','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:38','','',NULL),(100,'KR13','BOM','12','KR13-BOM-12','KR13-PC-01','KR13S00011','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:54:47','','',NULL),(101,'KR13','BOM','13','KR13-BOM-13','KR13-PC-02','KR13S00015','','Y','Y','N','','','','152','211.54.148.249','2023-12-14 14:18:47','152','211.54.148.249','2024-08-23 16:31:12'),(102,'KR13','BOM','14','KR13-BOM-14','KR13-PC-02','KR13S00022','','Y','Y','N','','','','152','211.54.148.249','2023-12-18 17:06:29','152','211.54.148.249','2023-12-18 17:09:01'),(103,'KR13','BOM','15','KR13-BOM-15','KR13-PC-02','KR13S00023','','Y','Y','N','','','','152','211.54.148.249','2023-12-19 17:31:41','152','211.54.148.249','2023-12-19 17:34:53'),(104,'KR13','BOM','16','KR13-BOM-16','KR13-PC-03','KR13S00024','','Y','Y','N','','','','152','211.54.148.249','2023-12-22 13:16:36','152','211.54.148.249','2024-07-24 09:27:47');
/*!40000 ALTER TABLE `bom_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buy_acc_list`
--

DROP TABLE IF EXISTS `buy_acc_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buy_acc_list` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ikey',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_allips.factory)',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 코드 (biz_list.cust_cd)',
  `acc_no` varchar(15) NOT NULL COMMENT '전표 번호 (acc_dt+hhiiss)',
  `ord_no` varchar(20) DEFAULT '' COMMENT '발주 번호 (buy_master.ord_no)',
  `work` enum('IN','OUT') DEFAULT 'IN' COMMENT '거래 구분 (IN: 매입 증감, OUT: 매입 차감)',
  `detail` varchar(5) DEFAULT '001' COMMENT '거래 상세 (AC/130)',
  `acc_dt` date DEFAULT NULL COMMENT '거래 일자 - 발주:발주일, 지급:거래일 (yyyy-MM-dd)',
  `acc_type` char(5) DEFAULT '' COMMENT '결제 방식 (AC/020)',
  `bl_cd` varchar(5) DEFAULT '' COMMENT '은행 코드 (AC/030 - 결제구분을 통장으로 선택시)',
  `acc_nm` varchar(255) DEFAULT '' COMMENT '예금주',
  `bl_num` varchar(255) DEFAULT '' COMMENT '계좌 번호',
  `amt` float DEFAULT 0 COMMENT '금액',
  `tax` float DEFAULT 0 COMMENT '세액',
  `vat` enum('Y','N','S') DEFAULT 'N' COMMENT '부가세 여부 (N: 과세, Y: 면세, S: 영세)',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_cust_cd_acc_no` (`local_cd`,`cust_cd`,`acc_no`) USING BTREE,
  KEY `FK_acc_list_copy_biz_list` (`cust_cd`) USING BTREE,
  CONSTRAINT `buy_acc_list_ibfk_1` FOREIGN KEY (`cust_cd`) REFERENCES `biz_list` (`cust_cd`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='발주 회계 장부 (매입/지급)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buy_acc_list`
--

LOCK TABLES `buy_acc_list` WRITE;
/*!40000 ALTER TABLE `buy_acc_list` DISABLE KEYS */;
INSERT INTO `buy_acc_list` VALUES (32,'KR13','KR13C00001','20231215055635','2023121578740','IN','001','2023-12-15','','','','',10000,1000,'N','','N','Y','N','152','211.54.148.249','2023-12-15 17:56:35','','',NULL),(33,'KR13','KR13C00001','20231219053157','2023121911765','IN','001','2023-12-19','','','','',10000,1000,'N','','N','Y','N','152','211.54.148.249','2023-12-19 17:31:57','','',NULL),(34,'KR13','KR13C00001','20231220023556','2023122077905','IN','001','2023-12-20','','','','',10000,1000,'N','','N','Y','N','152','211.54.148.249','2023-12-20 14:35:56','','',NULL),(35,'KR13','KR13C00001','20231222011712','2023122266697','IN','001','2023-12-22','','','','',30000,3000,'N','','N','Y','N','152','211.54.148.249','2023-12-22 13:17:12','','',NULL);
/*!40000 ALTER TABLE `buy_acc_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buy_detail`
--

DROP TABLE IF EXISTS `buy_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buy_detail` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 고유 코드 (biz_list.cust_cd)',
  `ord_no` varchar(20) NOT NULL DEFAULT '' COMMENT '발주 번호 (등록일자+난수 5자리 조합)',
  `ord_seq` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '순번',
  `ord_bseq` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '상세 순번-번들 (분할순번)',
  `lot` varchar(50) DEFAULT '' COMMENT '주문 로트 (발주번호+3자리 순번 조합)',
  `item_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '품목 코드 (item_list.item_cd)',
  `item_nm` varchar(20) NOT NULL DEFAULT '' COMMENT '품목 명 (item_list.item_nm)',
  `item_gb` longtext NOT NULL DEFAULT '' COMMENT '추가 분류 [JSON]',
  `ord_spec` longtext NOT NULL DEFAULT '' COMMENT '주문 상세 스펙 (규격/단위/분할) [JSON]',
  `ord_qty` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '수량',
  `unit_amt` float NOT NULL DEFAULT 0 COMMENT '매입 단가',
  `ord_amt` float NOT NULL DEFAULT 0 COMMENT '주문 금액',
  `tax_amt` float NOT NULL DEFAULT 0 COMMENT '세액 금액',
  `amt_unit` varchar(5) NOT NULL DEFAULT '001' COMMENT '금액 화폐단위 (공통 - 기본은 원)',
  `memo` longtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `ord_no_ord_seq_ord_bseq` (`ord_no`,`ord_seq`,`ord_bseq`),
  UNIQUE KEY `lot` (`lot`),
  CONSTRAINT `FK_buy_detail_buy_master` FOREIGN KEY (`ord_no`) REFERENCES `buy_master` (`ord_no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='[식품 제품군] 구매 발주 상세 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buy_detail`
--

LOCK TABLES `buy_detail` WRITE;
/*!40000 ALTER TABLE `buy_detail` DISABLE KEYS */;
INSERT INTO `buy_detail` VALUES (131,'KR13','KR13C00001','2023121578740',1,1,'2023121578740001','KR13S00018','14141','','{\"size\":\"123123\",\"unit\":\"005\"}',1,10000,10000,1000,'001','','N','Y','N','','','','152','211.54.148.249','2023-12-15 17:56:35','','',NULL),(132,'KR13','KR13C00001','2023121911765',1,1,'2023121911765001','KR13B00015','04','','{\"size\":\"250\",\"unit\":\"018\"}',1,10000,10000,1000,'001','','N','Y','N','','','','152','211.54.148.249','2023-12-19 17:31:57','','',NULL),(133,'KR13','KR13C00001','2023122077905',1,1,'2023122077905001','KR13B00015','04','','{\"size\":\"250\",\"unit\":\"018\"}',1,10000,10000,1000,'001','','N','Y','N','','','','152','211.54.148.249','2023-12-20 14:35:56','','',NULL),(134,'KR13','KR13C00001','2023122266697',1,1,'2023122266697001','KR13B00016','테스트 원자재','','{\"size\":\"400\",\"unit\":\"018\"}',3,10000,30000,3000,'001','','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:17:12','','',NULL);
/*!40000 ALTER TABLE `buy_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buy_master`
--

DROP TABLE IF EXISTS `buy_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buy_master` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 고유 코드 (biz_list.cust_cd)',
  `cust_nm` varchar(20) NOT NULL DEFAULT '' COMMENT '거래처(별칭) 명 (biz_list.cust_nm)',
  `biz_nm` varchar(20) NOT NULL DEFAULT '' COMMENT '사업장(고객) 명 (biz_list.biz_nm)',
  `ord_no` varchar(20) NOT NULL DEFAULT '' COMMENT '발주 번호 (등록일자+난수 5자리 조합)',
  `ord_dt` date DEFAULT NULL COMMENT '발주 일자 (yyyy-MM-dd)',
  `vat` enum('Y','N','S') NOT NULL DEFAULT 'N' COMMENT '부가세 여부 (N: 과세, Y: 면세, S: 영세)',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `state` varchar(5) NOT NULL DEFAULT '001' COMMENT '진행 상태 (PR/090)',
  `finyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '전표 마감 여부 (N: 대기, Y: 마감)',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `ord_no` (`ord_no`),
  KEY `ord_dt` (`ord_dt`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='[식품 제품군] 구매 발주 마스터 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buy_master`
--

LOCK TABLES `buy_master` WRITE;
/*!40000 ALTER TABLE `buy_master` DISABLE KEYS */;
INSERT INTO `buy_master` VALUES (40,'KR13','KR13C00001','현대 일렉트릭','현대 일렉트릭','2023121578740','2023-12-15','N','','002','N','Y','Y','N','','','','152','211.54.148.249','2023-12-15 17:56:35','152','211.54.148.249','2023-12-15 17:56:47'),(41,'KR13','KR13C00001','현대 일렉트릭','현대 일렉트릭','2023121911765','2023-12-19','N','','002','N','Y','Y','N','','','','152','211.54.148.249','2023-12-19 17:31:57','152','211.54.148.249','2023-12-19 17:33:28'),(42,'KR13','KR13C00001','현대 일렉트릭','현대 일렉트릭','2023122077905','2023-12-20','N','','002','N','Y','Y','N','','','','152','211.54.148.249','2023-12-20 14:35:56','152','211.54.148.249','2023-12-20 14:36:08'),(43,'KR13','KR13C00001','현대 일렉트릭','현대 일렉트릭','2023122266697','2023-12-22','N','','002','N','Y','Y','N','','','','152','211.54.148.249','2023-12-22 13:17:12','152','211.54.148.249','2023-12-22 13:17:22');
/*!40000 ALTER TABLE `buy_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ci_sessions`
--

DROP TABLE IF EXISTS `ci_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ci_sessions` (
  `id` varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` int(10) unsigned NOT NULL DEFAULT 0,
  `data` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ci_sessions_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='세션 관리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ci_sessions`
--

LOCK TABLES `ci_sessions` WRITE;
/*!40000 ALTER TABLE `ci_sessions` DISABLE KEYS */;
INSERT INTO `ci_sessions` VALUES ('004760401f9710be4a4c5ada4386408ea417c153','159.203.96.42',1720799966,'__ci_last_regenerate|i:1720799966;'),('00835eef0c44a8789a8b58b109a565bf4dcbe7b2','23.239.4.252',1723290486,'__ci_last_regenerate|i:1723290486;'),('0090b2b99a6c450a09017095478a118de46f8797','46.101.111.185',1724174858,'__ci_last_regenerate|i:1724174858;'),('0156b4485d75fb3a7144fed1147d88b96064148b','206.81.24.227',1721645029,'__ci_last_regenerate|i:1721645029;'),('017eb203c13d9179ed9e0730d303f4245be1ba7e','149.56.150.135',1722152399,'__ci_last_regenerate|i:1722152399;'),('01c3dd8d3c38765bbdc947cdcc8bb4a36fd359d2','188.165.87.108',1720963533,'__ci_last_regenerate|i:1720963533;'),('023f40f2f913732279b951752ccc11e865a3fe57','18.222.43.11',1720952602,'__ci_last_regenerate|i:1720952602;'),('032c935abe4472f8641110722d3a72d5de7ace6b','15.204.182.106',1723342746,'__ci_last_regenerate|i:1723342746;'),('03447662854fa068ac2e0ebe6a61d54e9df4e28c','64.226.78.121',1723080439,'__ci_last_regenerate|i:1723080439;'),('0376b89bebce67e6f9e123960c80481a6cdeb4e3','139.59.143.102',1720119870,'__ci_last_regenerate|i:1720119869;'),('03e332f67108becef425363f4ca462b279a96783','24.199.117.114',1724300921,'__ci_last_regenerate|i:1724300921;'),('06a064d28b4dec96b7063757cd1711e519d664c2','139.162.96.81',1722785337,'__ci_last_regenerate|i:1722785337;'),('07833dc0f44065779362797349c5816b5c7fa12a','23.239.4.252',1723290486,'__ci_last_regenerate|i:1723290486;'),('07ced7eaf66b85d1b9cf3b67775973a21696ca5e','167.71.81.114',1720982703,'__ci_last_regenerate|i:1720982703;'),('0902483041dfe2cc59c4a2846b88025069fe9e4b','44.192.107.30',1724273948,'__ci_last_regenerate|i:1724273948;'),('098f38e2032151339ea80bec6e5fd5ed0ac9cd82','139.162.96.81',1722785338,'__ci_last_regenerate|i:1722785338;'),('0a3b19ac827034682470c008d13e910c150aef8a','179.43.169.181',1720617454,'__ci_last_regenerate|i:1720617454;'),('0a6f3121eb5939a06574febec3f0fc1aa9e509c4','64.225.75.246',1722953179,'__ci_last_regenerate|i:1722953179;'),('0ae26bd01b2b019b2922080d8a41202cfff3c4db','172.105.16.131',1720284446,'__ci_last_regenerate|i:1720284446;'),('0b8c44870563a51594024e009249627d464e1b55','35.171.144.152',1724193892,'__ci_last_regenerate|i:1724193892;'),('0be585e5c898ece4b285430aababfb2b2c51d8e6','164.92.107.174',1721143217,'__ci_last_regenerate|i:1721143217;'),('0cd23b655e6b8ad1895168f28185d74a10369f82','35.171.144.152',1721177379,'__ci_last_regenerate|i:1721177379;'),('0f393535970e53ec5331169ec941db72332cdef0','165.227.84.14',1720428625,'__ci_last_regenerate|i:1720428625;'),('0fad23e162921f9801c249fc9ab95759b912dca7','138.68.144.227',1724351232,'__ci_last_regenerate|i:1724351232;'),('11d074bb3bb17e2fc347735b4b1ffa4aff10f9c3','172.105.16.40',1721654277,'__ci_last_regenerate|i:1721654277;'),('11fa6747c8a7619902ac6af87e3ff2de075e32d7','34.72.176.129',1720571880,'__ci_last_regenerate|i:1720571878;'),('1263f8037567b8f57b5732f283a20fc557ae87b0','159.65.201.48',1724007665,'__ci_last_regenerate|i:1724007665;'),('13077d2e7282612038fcda3c56f32e6d2651fe8c','211.54.148.249',1724041285,'__ci_last_regenerate|i:1724041285;'),('15ac33d0659fc0de39022762107533fe067b88bd','211.54.148.249',1721697809,'__ci_last_regenerate|i:1721695871;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('1701b2ae7f5177bc92953dcfcd98d61f32f7dfcf','207.154.212.47',1721985629,'__ci_last_regenerate|i:1721985629;'),('170c516534a188625cb88c812e7563a366e35c81','205.169.39.17',1720572489,'__ci_last_regenerate|i:1720572489;'),('1711a8fd5166664113dcdaf4ba99e9f818b46563','24.199.117.114',1724300921,'__ci_last_regenerate|i:1724300921;'),('1738e647e5c7e62c996bc02fcf70ef2aa8b6ae02','211.54.148.249',1722392515,'__ci_last_regenerate|i:1722392373;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('175ef805ddac5cf861a7ac5b85d4785f20cfe716','159.203.96.42',1720799961,'__ci_last_regenerate|i:1720799961;'),('196edf48cf62663b2864b2f07caea3677a67d89f','64.227.32.66',1723625558,'__ci_last_regenerate|i:1723625558;'),('19d29ec913e872e7603b857c2ebe545240036faa','185.217.149.188',1723194831,'__ci_last_regenerate|i:1723194831;'),('1a508fa0694f23756ef2a219cd94836535e3cf53','179.43.169.181',1720571946,'__ci_last_regenerate|i:1720571946;'),('1ae53cbeca6c70cec49f8e8424a7eff3cf79b4cd','15.204.182.106',1720574453,'__ci_last_regenerate|i:1720574453;'),('1bfcf8962a2a8e53890f694a84358720738739cc','87.236.176.132',1720996206,'__ci_last_regenerate|i:1720996206;'),('1c8b52fc8d339e04aea82f637af683fbfd7663c6','199.45.154.134',1721959887,'__ci_last_regenerate|i:1721959887;'),('1cd78320c12efa43d81bb773b81861e79d0a46dd','159.89.17.243',1720965225,'__ci_last_regenerate|i:1720965225;'),('1e286c014a5969a789f7d3e7ff226935a9db0651','165.227.84.14',1720428626,'__ci_last_regenerate|i:1720428626;'),('1eafa7bbe90bdaff24c8d7746cd48587fc89dc5c','57.128.87.194',1724456410,'__ci_last_regenerate|i:1724456410;'),('2097806f6c94a0919352b3e13fd8e3d99386ffb5','64.225.75.246',1723254681,'__ci_last_regenerate|i:1723254681;'),('20cb4848a6b8a2191728dc9e5b954dced652af03','138.197.191.87',1724499500,'__ci_last_regenerate|i:1724499500;'),('210cbdd070ac2c15e9a61a4826e8367ac7c764f4','23.239.4.252',1723290491,'__ci_last_regenerate|i:1723290491;'),('21d969562ae772a649b5e6920597cbf498c65eb1','207.154.212.47',1724677049,'__ci_last_regenerate|i:1724677049;'),('21eae7d688482fe037a71924fb1e1e871f03bc26','159.89.17.243',1720965241,'__ci_last_regenerate|i:1720965241;'),('22d21a52eacc2e8c81b3c5f019fd87b9df8e61cf','164.92.244.132',1720795825,'__ci_last_regenerate|i:1720795825;'),('22f0f05170355589df91c362ea94510e76ae346b','211.54.148.249',1721780890,'__ci_last_regenerate|i:1721779937;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('231ca7b198e3bf22c9dfb46748e00d7d5d3d4590','167.94.138.36',1720347325,'__ci_last_regenerate|i:1720347325;'),('23522c39f40287858ec6fa3836c04384dcbe8034','167.99.210.137',1723436937,'__ci_last_regenerate|i:1723436937;'),('245dd88649afa901c03086c57c1d43e9356bffc1','138.68.144.227',1724351239,'__ci_last_regenerate|i:1724351239;'),('25e1fc2ddd0ef006343cd48df7c1b881831a8a82','139.59.143.102',1721310789,'__ci_last_regenerate|i:1721310789;'),('25f51787755d6ef1ab22e141c13801db78e444ec','64.227.161.107',1720688632,'__ci_last_regenerate|i:1720688632;'),('25fde1c756d1d0eaa74c61d9a4cdafde59815beb','194.55.186.87',1721618365,'__ci_last_regenerate|i:1721618365;'),('2617004f5c1dfa5c87c059428b01845b8a54525a','47.254.76.138',1720615387,'__ci_last_regenerate|i:1720615387;'),('26ed0d8b2d028826f080b9d51c8200127d7f0e76','209.97.180.8',1722984029,'__ci_last_regenerate|i:1722984029;'),('27b686e2cc11c808dd90b7680613f0f347d403bd','119.207.182.156',1724761113,'__ci_last_regenerate|i:1724761105;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('2864a52bc27779fa10a811f0febc979ae6744b03','51.81.46.212',1724339322,'__ci_last_regenerate|i:1724339322;'),('28c31ea5cd1dbe71dcaaa071d4ae4b010c943396','23.239.4.252',1721153723,'__ci_last_regenerate|i:1721153723;'),('29843df9131996790698ef050f4098fa81e837b4','143.110.217.244',1720606871,'__ci_last_regenerate|i:1720606871;'),('2a94204d38f38a65ed7ed1cfa8d12f4bdc8f144e','205.169.39.229',1720571889,'__ci_last_regenerate|i:1720571888;'),('2b1ddb8d962f5d23042136215f5049562989e1d4','133.242.174.119',1720582789,'__ci_last_regenerate|i:1720582788;'),('2b44614ad7a3ffd2c634e1eab369a0d8f16b337f','52.167.144.218',1723550260,'__ci_last_regenerate|i:1723550260;'),('2c6c945455bfc934a2c55287d4303e3017800125','172.105.16.131',1720284434,'__ci_last_regenerate|i:1720284434;'),('2da3ac6eaa830698aad5d47333b18d683b27e2f8','165.227.84.14',1720428633,'__ci_last_regenerate|i:1720428633;'),('2e24eff2fc1542e323bd5fe1bb7343b5c4accd1b','62.141.44.236',1722959638,'__ci_last_regenerate|i:1722959638;'),('2e7072e672b21ac9160ea2abf1846b2cd246594d','207.154.212.47',1720636650,'__ci_last_regenerate|i:1720636650;'),('2f8d50e43328ec614d8ca172ce07ca75c6afc8f7','165.22.235.3',1721483382,'__ci_last_regenerate|i:1721483382;'),('300ac4d713e871f29984078364495d3b112477c1','64.226.78.121',1723080424,'__ci_last_regenerate|i:1723080424;'),('312595119d5109ab378e67a173af08b9bad9af96','207.154.212.47',1720571873,'__ci_last_regenerate|i:1720571873;'),('32900db3b270aa5834560c241b545c26d094dad9','46.101.111.185',1724708984,'__ci_last_regenerate|i:1724708984;'),('32a1c244065d1a282c51f4a05589b44881e8d962','222.97.255.112',1724761617,'__ci_last_regenerate|i:1724761546;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('3411d31ad4bb787b02d7adcfe578782583f4882d','165.22.235.3',1722207808,'__ci_last_regenerate|i:1722207808;'),('34b9f60b05d2ef89ab1b2f91117790a72e9dff10','172.105.158.219',1724167527,'__ci_last_regenerate|i:1724167527;'),('354c4100eb9dcf6e07ef2a91bdae11fa447ba565','172.105.158.219',1724167521,'__ci_last_regenerate|i:1724167521;'),('35f84374b6b3cc9dc8816732dacea2d68b5e8736','205.169.39.47',1720600811,'__ci_last_regenerate|i:1720600811;'),('3603e48f0a6153eadf86ba6a80fdedaabba4c6a7','159.89.12.166',1721809086,'__ci_last_regenerate|i:1721809086;'),('3751722b184dd1f8c127fe46f94129c2e1cd8e97','24.199.117.114',1724300926,'__ci_last_regenerate|i:1724300926;'),('381dafe4930d4270b67a02d0aab06c73233c935a','139.59.143.102',1720119881,'__ci_last_regenerate|i:1720119881;'),('38289a67a11fcac8eeb566a653f77272ac8b2ade','152.42.229.242',1720770236,'__ci_last_regenerate|i:1720770235;'),('3863a6a4ff16f3a3a41a1681129575e0f0111468','64.227.161.107',1720688635,'__ci_last_regenerate|i:1720688635;'),('3982509bf508a09581ba03a8fb74c456be22024d','46.228.199.158',1724594076,'__ci_last_regenerate|i:1724594076;'),('3994daba1e75ae3756d1f5a4fb8eee3ffe77821b','46.101.111.185',1724174864,'__ci_last_regenerate|i:1724174864;'),('3c1554bee651b97f436b65f7f7a97772c60160ec','64.225.75.246',1723807345,'__ci_last_regenerate|i:1723807345;'),('3c5f4381678580f63ca69f8b366cbae842e0c243','13.215.154.132',1721018038,'__ci_last_regenerate|i:1721018038;'),('3c8a0b37423a2a16786c91e5bcb321dd461ede51','138.197.135.24',1721869461,'__ci_last_regenerate|i:1721869461;'),('3d9bbc36fdc8ba78dae8766206626da0a717eadc','178.254.38.45',1724012322,'__ci_last_regenerate|i:1724012322;'),('3e38ba47fc90276e1dc34faed083074542d2cd8a','87.236.176.58',1724443196,'__ci_last_regenerate|i:1724443195;'),('3eb5de75c806f9bec98ec5ab1088d96a8c9b729c','206.81.24.227',1721645052,'__ci_last_regenerate|i:1721645052;'),('4007bf2ec5cb1fb5c8b18b4c75c19b93667d851f','167.99.189.161',1723093122,'__ci_last_regenerate|i:1723093122;'),('4128d892ff4ba222622b56cca25896802e1ec03d','87.236.176.9',1724413794,'__ci_last_regenerate|i:1724413794;'),('4286f58901ed28b837d202679e277d0f52ab85cc','18.201.51.51',1720096413,'__ci_last_regenerate|i:1720096413;'),('437d87bf0c88f035262465ab7107febebde599c4','207.154.212.47',1722486895,'__ci_last_regenerate|i:1722486895;'),('4392e6a0f1636b693fd6f9fb4fd679f625432b50','164.92.107.174',1721143217,'__ci_last_regenerate|i:1721143217;'),('459541ca167e504cf10c8b60903837f18c6cdfe0','167.99.210.137',1723436916,'__ci_last_regenerate|i:1723436916;'),('465ab95ef60d87666abe0cf912baa21888e97706','40.77.167.55',1720403277,'__ci_last_regenerate|i:1720403276;'),('46720f677f7f997718d87e995a580d349b6bfe73','209.97.180.8',1722984015,'__ci_last_regenerate|i:1722984015;'),('467b631e1d7080787a796eebe95dc9f9cb31a784','172.105.158.219',1724167520,'__ci_last_regenerate|i:1724167520;'),('47887b214aeeff452d10ced022868052918eb2f7','138.197.135.24',1721869456,'__ci_last_regenerate|i:1721869456;'),('4873cfd6b47579beef933fa7142cfa177b828f0f','208.115.210.223',1723216638,'__ci_last_regenerate|i:1723216638;'),('49312942041942e6e4f2c35ee823d026eb2b8522','159.89.12.166',1721318790,'__ci_last_regenerate|i:1721318790;'),('4985326f2a986128ed3241ee042e8527a3b8a422','172.105.16.40',1721654269,'__ci_last_regenerate|i:1721654269;'),('49ab6ef15d78155bcffc9956a5d0049b15c04e06','162.62.61.134',1720825849,'__ci_last_regenerate|i:1720825848;'),('4b3580c81a66c430ff18cac9ec02a1d58d4b4235','64.227.161.107',1720688632,'__ci_last_regenerate|i:1720688632;'),('4c76938a05ea15de2344a5bddcf44d447f9f9ca9','147.182.149.75',1722614809,'__ci_last_regenerate|i:1722614809;'),('4cbf5bd0d37e6f87696e710f57238fbc79b1175f','62.141.44.236',1721180987,'__ci_last_regenerate|i:1721180987;'),('4ccb2dfd97daf5707fd4b1905de4447e1fcc1e12','206.168.34.33',1722282236,'__ci_last_regenerate|i:1722282236;'),('4d92e173acd87ffef3adcdfd773c1914c4de7918','64.74.160.242',1722931752,'__ci_last_regenerate|i:1722931752;'),('4fd79cc0d2d1ca091e22178346d95489867348f7','139.162.155.225',1724341861,'__ci_last_regenerate|i:1724341861;'),('50bf052759e0c8a76195df4ff0f9df3816c2e200','207.154.197.113',1723812543,'__ci_last_regenerate|i:1723812543;'),('5138ded411a6bfe0844150f221ad44a388e56956','211.54.148.249',1722903194,'__ci_last_regenerate|i:1722902998;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('51fd362da7e3b7d124e6536f704aac3961e1b106','37.187.215.247',1720972641,'__ci_last_regenerate|i:1720972641;'),('52870851bdb2a4697483b05a76224d6cea6b52f1','64.227.189.240',1723838750,'__ci_last_regenerate|i:1723838750;'),('535619149c9a3a2bc335b669b0edab33ffd682de','147.182.129.4',1720901811,'__ci_last_regenerate|i:1720901811;'),('535bf1174991e8e4a008673eb290d61c8cc7c34a','178.254.38.45',1720572512,'__ci_last_regenerate|i:1720572512;'),('57170aa4045ab82f8cba283ce6b9b09c99723cac','211.54.148.249',1724200579,'__ci_last_regenerate|i:1724200579;'),('575c9165209983ba69b8d7f9c9f39adb8341a171','51.81.46.212',1724339320,'__ci_last_regenerate|i:1724339320;'),('58ec06096874daf1afb6120ce8ce69d9a9b4d81f','211.54.148.249',1722301276,'__ci_last_regenerate|i:1722301047;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('597b76bd07f32e3c36060c7eb7b90b145c8d4b1e','171.244.43.14',1720615709,'__ci_last_regenerate|i:1720615709;'),('59eaeb537739a7ab878b701a5e5527cb432c0d40','139.162.141.82',1723987532,'__ci_last_regenerate|i:1723987532;'),('59f765451075606c8954fef071e74180e653f6b3','205.169.39.24',1722385179,'__ci_last_regenerate|i:1722385174;'),('5a3972af1b2c3480633811264126c4c0c85eaec6','209.38.248.17',1721483906,'__ci_last_regenerate|i:1721483906;'),('5a9f055590e38b37245147dc50c22f6fd0212f8b','159.65.201.48',1724007659,'__ci_last_regenerate|i:1724007659;'),('5b0db911973cdd401173fb1c1024ba6d8fa876dd','146.70.128.230',1720572102,'__ci_last_regenerate|i:1720572102;'),('5b0e6f9cc96876a3641ce49a75a7fea27b891e58','164.92.107.174',1721143223,'__ci_last_regenerate|i:1721143223;'),('5c2bc34a679520a041b35324ae3847edf9582d6e','147.182.129.4',1720901818,'__ci_last_regenerate|i:1720901818;'),('5cb6460938bbfdd64bba978323800676299018ef','165.22.235.3',1722177121,'__ci_last_regenerate|i:1722177121;'),('5d5e71e706cc12a3aefa2d5ad8ad852a6736f479','207.154.212.47',1722486906,'__ci_last_regenerate|i:1722486906;'),('5da0ac68aa6ee74db595cf5d3c0e5c30c4d0ed28','138.197.191.87',1724499490,'__ci_last_regenerate|i:1724499490;'),('603ddd91049ac7deee2e0c10b3a272b2c0cbfb0f','96.126.110.54',1723978295,'__ci_last_regenerate|i:1723978295;'),('6115a937fb3951f8878a22f6ca2a4608908e1ec5','54.88.179.33',1721177376,'__ci_last_regenerate|i:1721177376;'),('62d85001a45329e2a213044d26312041efe5f1b5','206.81.24.227',1721645036,'__ci_last_regenerate|i:1721645036;'),('62f632acf3a6918baef805e50e44d620b26645ec','45.135.57.222',1724529843,'__ci_last_regenerate|i:1724529843;'),('6386e1ab7a6f90b888e5fd01485a0c9cda7c5748','207.154.197.113',1723812543,'__ci_last_regenerate|i:1723812543;'),('63b664b81cc9e87c086cccf827e6557eeb30d733','164.90.228.79',1724528635,'__ci_last_regenerate|i:1724528635;'),('63be43ebf8efba4d7c1819dbb0ddf289d1e86716','206.189.233.36',1723453655,'__ci_last_regenerate|i:1723453655;'),('63fdc35f43e250b1e14b9dd22db10ea3c713818b','139.162.155.225',1724341861,'__ci_last_regenerate|i:1724341861;'),('6458f0c835e0f2b5d50b128cc1a13184f2d2e7d8','139.162.210.205',1723120389,'__ci_last_regenerate|i:1723120389;'),('64c92aaa7b524f1e8d3c24f274fd21ac9bd79218','172.105.16.40',1721654269,'__ci_last_regenerate|i:1721654269;'),('65706d3ba3bbffcb9e62bde786173e1ee3567ba2','211.54.148.249',1722486884,'__ci_last_regenerate|i:1722486764;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('661dc51772ebaa72e80eee1e341f44a5a7c68fc9','205.210.31.46',1723984602,'__ci_last_regenerate|i:1723984602;'),('674dedf6a6bf2038f7e0880fa60260f51e9d621d','45.135.57.222',1724529842,'__ci_last_regenerate|i:1724529842;'),('6797ae3539c4610cc91458d528c92392c61d5fd7','207.154.212.47',1720443481,'__ci_last_regenerate|i:1720443481;'),('67eb65f8d37f2feb7811607267a978437dd0516e','164.90.228.79',1724528657,'__ci_last_regenerate|i:1724528657;'),('6805d6edd0f8bffbaf525fa5002664afb6e45cfe','35.171.144.152',1721278404,'__ci_last_regenerate|i:1721278404;'),('681a470e01a3dd8c18ae4297886ccba0ac648a27','167.71.81.114',1720982711,'__ci_last_regenerate|i:1720982711;'),('682b9c5a5bdf6c263a12d6e111c86118f726c35f','35.171.144.152',1721177379,'__ci_last_regenerate|i:1721177379;'),('685d5ba4b6e2e8189ffb9a4fae1fac0895cccf81','199.45.155.72',1720351677,'__ci_last_regenerate|i:1720351677;'),('6a946288c1c9434afad47377eb668f4bf5935455','159.65.201.48',1724007657,'__ci_last_regenerate|i:1724007657;'),('6b233efe0f98e9598c9c643030ca1a29f2658a13','47.88.90.156',1720615463,'__ci_last_regenerate|i:1720615463;'),('6c791dac6c8cc6139642dbbebabbde3042114e5f','15.204.182.106',1720574454,'__ci_last_regenerate|i:1720574454;'),('6d43e3957b4b0fe3e401babb28c9055a0e8657e0','54.88.179.33',1721177377,'__ci_last_regenerate|i:1721177377;'),('6dd9a71c7cbff768a9253808081bacc8caf1e27c','217.160.202.182',1723498038,'__ci_last_regenerate|i:1723498038;'),('6e323cb1adf76d2524a316496e21195249c65ee4','165.22.235.3',1722207816,'__ci_last_regenerate|i:1722207816;'),('6ea4b63f806d62e2923b37e7395c8c058cb63c9e','110.92.23.101',1722477414,'__ci_last_regenerate|i:1722477414;'),('6f3d6fd3e5047ab7193763ef2879b0b75707a156','64.225.75.246',1722953191,'__ci_last_regenerate|i:1722953191;'),('6fb68f70a7caf183012320eb15fcc9416aa75f95','147.182.149.75',1722614824,'__ci_last_regenerate|i:1722614824;'),('7017a85e2a453bee14bb94df8c1659e274526f3a','159.89.12.166',1721809094,'__ci_last_regenerate|i:1721809094;'),('70adf8243d0fdd3d909f8b28aaddfe74e7a9423e','18.222.43.11',1720894591,'__ci_last_regenerate|i:1720894590;'),('70f94da1206793f9d19b697afd3714f0f7f4ecef','64.227.32.66',1722339460,'__ci_last_regenerate|i:1722339460;'),('71b0b7863baed848190154d9c9e39ed379deb2ed','139.162.96.81',1722785343,'__ci_last_regenerate|i:1722785343;'),('72af2f41f10924c266474d0804859bd9a6ce0f8b','167.99.210.137',1723436923,'__ci_last_regenerate|i:1723436923;'),('7342e1030c0614390509e22ee45a9f2eeb21d2b5','45.56.187.12',1723194829,'__ci_last_regenerate|i:1723194829;'),('7357e0d2f8848a7ffa2f3aef256a3d1e76018311','139.162.155.225',1722804253,'__ci_last_regenerate|i:1722804253;'),('737083047f2b049dd58a31e94a1d8df76acf9678','23.239.4.252',1721153714,'__ci_last_regenerate|i:1721153714;'),('75030f51137b00db778874c357ff95a8c5c2df6d','64.225.75.246',1723254657,'__ci_last_regenerate|i:1723254657;'),('76713da81bccc337ae6373d693feed68b3b91c2a','64.225.75.246',1723807331,'__ci_last_regenerate|i:1723807331;'),('76c7386a4f42244df873555a74967a5d79ba90b3','167.71.81.114',1723617236,'__ci_last_regenerate|i:1723617236;'),('771968b3b1d0c3274e5fc29eec2127ae77b29c15','167.172.232.142',1720261176,'__ci_last_regenerate|i:1720261176;'),('78c864c136df5940408ba9fd4caa38cd8407e617','217.160.202.182',1723498037,'__ci_last_regenerate|i:1723498037;'),('790aa802fd84a600fc17e60e3bb03159470e213a','40.77.167.27',1722887989,'__ci_last_regenerate|i:1722887987;'),('7a74975a8539e41dc36221dfb43cc2623fd316b7','143.110.217.244',1720606877,'__ci_last_regenerate|i:1720606877;'),('7b00916cd5da1e36d04e4010174edc3dba4b34c5','54.88.179.33',1722465300,'__ci_last_regenerate|i:1722465300;'),('7be38ff1db7988dc496acbfb4265cf68f51bcc00','64.227.161.107',1720688641,'__ci_last_regenerate|i:1720688641;'),('7c76697b7aaa9d6afe0a304df86afcc458283394','64.225.75.246',1722953180,'__ci_last_regenerate|i:1722953180;'),('7e60b5b8d4e57feb4384ce9bc330b7239f755887','211.54.148.249',1723079099,'__ci_last_regenerate|i:1723078968;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('80baf46344171317435ffad2ca52ae91bcab5f50','35.171.144.152',1721278404,'__ci_last_regenerate|i:1721278404;'),('828370eea955ca553c08b882fc055e5e28f821c4','205.210.31.46',1723984604,'__ci_last_regenerate|i:1723984603;'),('8450d27131ff66e32d0b14b83cd23e248e6756b4','147.182.200.94',1721822985,'__ci_last_regenerate|i:1721822985;'),('8655f19e1eb6ef89af4e16d32c2a34c29d899df9','139.162.155.225',1722804246,'__ci_last_regenerate|i:1722804246;'),('86e461cbd1443ca83086cb19b340a1868088b149','54.88.179.33',1722465300,'__ci_last_regenerate|i:1722465300;'),('8709683064ed37d0b3a96984f411241c3e94e0a9','64.225.77.81',1720727290,'__ci_last_regenerate|i:1720727290;'),('8864e933123921649cd4ed916bce7ba6331be7f1','209.38.208.202',1722507270,'__ci_last_regenerate|i:1722507270;'),('88ced319ae30b6e3702e8efad5cef51e4b7bc6ee','54.88.179.33',1722451446,'__ci_last_regenerate|i:1722451446;'),('896eec8fa955fb7ab7d52e0513d02ce5b218bfa6','64.225.77.81',1720727299,'__ci_last_regenerate|i:1720727299;'),('8a087b3af171c1c2788f4500b226363d3603d03c','51.254.49.102',1720968986,'__ci_last_regenerate|i:1720968986;'),('8cf3f5a5690bbd62dc016270fb22a311048cdbb5','211.54.148.249',1721875835,'__ci_last_regenerate|i:1721875392;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('8e1d3c29f5b365ce9f654910f91a939325006930','208.115.210.223',1723216638,'__ci_last_regenerate|i:1723216638;'),('8e7f3533f33ddf4d8602ec3ad9f30aadd4155db9','179.43.169.181',1720571946,'__ci_last_regenerate|i:1720571946;'),('8f0fdea8077e9e53508cb3e592ec3f38e1a77ce1','94.247.172.129',1724400939,'__ci_last_regenerate|i:1724400938;'),('8f96b009b8405602713b40a816c0a41724b76826','64.227.189.240',1723838743,'__ci_last_regenerate|i:1723838743;'),('8fb24120d3a7782a10d6f33e545ef2e4e69fe81c','164.90.228.79',1724528642,'__ci_last_regenerate|i:1724528642;'),('908c10b28e8ed46d7423c9323fcff5da4c491870','47.88.90.156',1720615462,'__ci_last_regenerate|i:1720615462;'),('915eb2615f5de550af779a42569268d592d87440','139.162.141.82',1723987539,'__ci_last_regenerate|i:1723987539;'),('947a3e78ddbd96dd3131e026943f30f560640ec9','211.54.148.249',1724398282,'__ci_last_regenerate|i:1724398282;'),('960ccc5c0c6c98e9f107fd3982740b8ed87c368c','207.154.212.47',1720636634,'__ci_last_regenerate|i:1720636634;'),('975b63e60a6067aa4f139d988e63f8a4555f4b2a','139.162.210.205',1723120380,'__ci_last_regenerate|i:1723120380;'),('98115d83a8021137cec782fe9a73866c2a098a30','209.38.248.17',1721483913,'__ci_last_regenerate|i:1721483913;'),('983bf573ca405e0011711a324cd9d8de173130e7','35.171.144.152',1724193891,'__ci_last_regenerate|i:1724193891;'),('98de966f2f1cce339ae7818e88c6b9dc15ae78a0','188.165.87.100',1720963477,'__ci_last_regenerate|i:1720963477;'),('999bb3a8e9a49db31b4d7d04ba629a602164505c','198.235.24.100',1723818112,'__ci_last_regenerate|i:1723818112;'),('99ce937c1eb91b7182a9e1f2e945981e3f922b63','209.38.248.17',1721483929,'__ci_last_regenerate|i:1721483929;'),('9b091a578dd13debb00af86a87b4cdae2fa0da7e','64.227.32.66',1722339483,'__ci_last_regenerate|i:1722339483;'),('9b122218db12cfdc56a2787b150f0c8ac7c6bda0','207.154.212.47',1722583242,'__ci_last_regenerate|i:1722583242;'),('9bde934088c11d4abb29261c7ef3e7ffcf88fd31','164.92.244.132',1720795825,'__ci_last_regenerate|i:1720795825;'),('9c6bebaf70a1e98f12931179b116adaaa872e8d3','167.172.232.142',1720261175,'__ci_last_regenerate|i:1720261175;'),('9cacdd1a3d2278cdaf1f1c14a7bbc83c1c781165','205.169.39.229',1720571901,'__ci_last_regenerate|i:1720571901;'),('9e7798e1e7553a37f2bdc75e8313871718353198','159.89.12.166',1721318799,'__ci_last_regenerate|i:1721318799;'),('9f24de4ea0d4e4b3fc3df96c2f788ca5b6414269','211.54.148.249',1723507890,'__ci_last_regenerate|i:1723507890;'),('9f98e502a4bc97b3bf8e3eea2e477c8107ca3e09','138.68.144.227',1724351253,'__ci_last_regenerate|i:1724351253;'),('9f9bd7371f772d6f06fb0da3c8a0c4dbe2afbd4e','152.42.229.242',1720770235,'__ci_last_regenerate|i:1720770235;'),('9fd9620fa191b542c0bbdd9712bcee5cf7f46643','209.38.208.202',1722507291,'__ci_last_regenerate|i:1722507291;'),('a0571c18ae0b9fbc1daf087fe4117e057ab91bf0','110.92.23.101',1722477414,'__ci_last_regenerate|i:1722477414;'),('a16b3809ee8e0825c1245b1824a3ba586cf088fa','62.141.44.236',1722959639,'__ci_last_regenerate|i:1722959639;'),('a24158a26f457ab89da71bc1a62dd1ca966edcc0','167.71.81.114',1723617225,'__ci_last_regenerate|i:1723617225;'),('a2bacbbd56a3958733d11cabd0238cdd35bfa763','15.204.182.106',1723342746,'__ci_last_regenerate|i:1723342746;'),('a509f017733e72d1a50aacbec02d23f9727c32ef','35.171.144.152',1722451445,'__ci_last_regenerate|i:1722451445;'),('a5342f97a8419b31eb31073d98f4cd519d88647d','118.235.11.21',1724638203,'__ci_last_regenerate|i:1724638203;'),('a54a344ff641d4a0410c141bc29d5880f097f46f','54.88.179.33',1724170756,'__ci_last_regenerate|i:1724170756;'),('a557a7c902ee6af32b0c8cc95a7bd8a9300205f0','157.230.19.140',1722044796,'__ci_last_regenerate|i:1722044796;'),('a59165a30e96445103ab095d182aabbd2f133049','35.171.144.152',1724170758,'__ci_last_regenerate|i:1724170758;'),('a5ce8325d114531382680b4ec630fba4253ec6df','179.43.169.181',1720617453,'__ci_last_regenerate|i:1720617453;'),('a6f7789c224475c0ae03e18fc42ed3b7d5982f31','205.210.31.41',1723930500,'__ci_last_regenerate|i:1723930500;'),('a70451641776381db443cb78dd5f08e3ba72dae3','46.101.111.185',1724174879,'__ci_last_regenerate|i:1724174879;'),('a79c4b6e22b4fe4f9a7a9afc62ffd51ac50ead4d','46.101.111.185',1724708962,'__ci_last_regenerate|i:1724708962;'),('a80748dec129392741dc8633c4c74d0ebea991a8','195.90.221.76',1722404796,'__ci_last_regenerate|i:1722404796;'),('a82df06c1b8c2f7cb8aac20dca6894455d821f9a','52.167.144.176',1720079338,'__ci_last_regenerate|i:1720079337;'),('a94b70e705203cfbe5be454c4390763e3aa96a28','199.45.155.72',1720351663,'__ci_last_regenerate|i:1720351663;'),('aa651238b59a170d9a70082b3709413d0aefc374','34.240.39.232',1723137598,'__ci_last_regenerate|i:1723137598;'),('aacddcfc71afae1ac811ae4d2e6f3f2ca137cfaa','149.56.150.230',1722152428,'__ci_last_regenerate|i:1722152425;'),('ab478f317745254c3620006944625eb039080c07','139.162.210.205',1723120379,'__ci_last_regenerate|i:1723120379;'),('ab61f7428d3e6424492542e87d829156a2e4bbea','165.22.235.3',1721483388,'__ci_last_regenerate|i:1721483388;'),('abe2fe77953eb235fcedb07c97eb339c2617934c','64.225.75.246',1723254664,'__ci_last_regenerate|i:1723254664;'),('ac8c0f425ae2f9f11c61eb4df237b9207056c1d6','207.154.212.47',1720636626,'__ci_last_regenerate|i:1720636626;'),('ac93c6eda2ad5769d47090a3e4c4d7df26677cd3','138.197.135.24',1721869455,'__ci_last_regenerate|i:1721869455;'),('ae58f7efa388d64b2b5093e7ce81a19f4d1fbb96','159.203.96.42',1720799978,'__ci_last_regenerate|i:1720799978;'),('ae94610baae3e3a058a75c06ed709713e667283f','209.97.180.8',1722984008,'__ci_last_regenerate|i:1722984008;'),('afd844b9daa0ac24d0209b801d399d4a06723ab7','49.247.20.86',1722438002,'__ci_last_regenerate|i:1722438002;'),('b09a285dc70733d3fddeaf629c8345de6f82e172','192.46.211.230',1722321543,'__ci_last_regenerate|i:1722321543;'),('b11bb112430805276c4bbe89b5411abf496527f8','159.89.12.166',1721318790,'__ci_last_regenerate|i:1721318790;'),('b150d9b0b3e64c8165eeb206ea7107b533d012a7','207.154.197.113',1723812553,'__ci_last_regenerate|i:1723812553;'),('b1b6a3cb3e9ff5517d05a57b88f0d367320e5f67','164.90.228.79',1720571874,'__ci_last_regenerate|i:1720571874;'),('b1fd06ec7b16c1cbd2537bab943123b966af6620','138.197.191.87',1724499490,'__ci_last_regenerate|i:1724499490;'),('b26e52f41fc873cc8f656c024629e68c57c77b7c','178.254.38.45',1721829080,'__ci_last_regenerate|i:1721829080;'),('b308caa44114e1cee0e4d752f1e46c0a01b76941','37.187.215.255',1722274901,'__ci_last_regenerate|i:1722274901;'),('b30e9a80a11076fe8adb742d067444bb0d8a9f58','54.88.179.33',1724170756,'__ci_last_regenerate|i:1724170756;'),('b38b01b575acf5f4beabe09e7722dd4ecf6d28a7','192.46.211.230',1722321553,'__ci_last_regenerate|i:1722321553;'),('b487cf7f8e1cd7c9d4b7369e405b730162238fa2','147.182.200.94',1721822985,'__ci_last_regenerate|i:1721822985;'),('b49b44c57a148c17f01dfde4f73084aaf7569d60','147.182.129.4',1720901811,'__ci_last_regenerate|i:1720901811;'),('b5e28d56d89ad3a83ef6a6e9070b750e91688317','51.195.92.134',1720869430,'__ci_last_regenerate|i:1720869430;'),('b7f4f2786ee4c9d3039ef55c9b853a02ed132289','167.94.138.36',1720347312,'__ci_last_regenerate|i:1720347312;'),('b9090694f10e2a0c9fca18af9f55020be8596229','172.105.16.131',1720284429,'__ci_last_regenerate|i:1720284429;'),('b99a716ef0b1246878c146dc14146cf57ae8464b','95.217.18.177',1720701445,'__ci_last_regenerate|i:1720701445;'),('b9b3c3b56e2cbee4a07d441ed7255ec4e7b25668','149.56.150.135',1722152400,'__ci_last_regenerate|i:1722152395;'),('b9cca8e2ee8c9537624580d287ea00d5df3efcfb','207.154.212.47',1721985613,'__ci_last_regenerate|i:1721985613;'),('ba6150e83a6060d0c64183ece17a0124771c58cb','46.228.199.158',1724594076,'__ci_last_regenerate|i:1724594076;'),('bb87e6dcf064fd6bd3de7fd8232c313e6dde9545','139.59.143.102',1721310808,'__ci_last_regenerate|i:1721310808;'),('bb8ca37bed01593dbe25ebd6e75519f8a43228b1','207.154.212.47',1720443459,'__ci_last_regenerate|i:1720443459;'),('bbf034ffc95858ef8190fc28edf163655dbf9069','206.168.34.33',1722282224,'__ci_last_regenerate|i:1722282224;'),('bc3d4c0cc10a88d9103e1c7e3b3d8b8f38f01eae','207.154.212.47',1724677038,'__ci_last_regenerate|i:1724677038;'),('bc8a6d9c363fb893f3f49dbbe3377e0f75bbd6c1','205.210.31.238',1724223553,'__ci_last_regenerate|i:1724223553;'),('bed5aea80d6265d08553cfd63ef7a6a2874a37f4','96.126.110.54',1723978302,'__ci_last_regenerate|i:1723978302;'),('bf0d79c5014915754295db5f38b7886c823372ac','207.154.212.47',1720443466,'__ci_last_regenerate|i:1720443466;'),('bfe89f3e2dd5b5250c6e1fc7d372c9f0b0516eb1','165.22.235.3',1722177116,'__ci_last_regenerate|i:1722177116;'),('c0c41723c56d75ecedb59844b9b72c1c4f12d423','178.254.38.45',1721829081,'__ci_last_regenerate|i:1721829081;'),('c6b3522c5983f18ea42d394c49a7a3df3714b58c','178.254.38.45',1724012322,'__ci_last_regenerate|i:1724012322;'),('c9fae0158534c149ca732dcaaa532201b7e338ab','164.90.228.79',1720571873,'__ci_last_regenerate|i:1720571873;'),('cade9ea56f68abd2317778b900faa09e83b021b8','159.89.17.243',1720965218,'__ci_last_regenerate|i:1720965218;'),('cb22352f6cb89a0a5513dc57b5c357d3cc5a8987','164.92.244.132',1720795834,'__ci_last_regenerate|i:1720795834;'),('cc3141a2e19ac1a0e5fa7d28cc85bd7dfae0ed1f','207.154.212.47',1722486896,'__ci_last_regenerate|i:1722486896;'),('cc433253d8214fd55f05102ab51ad43f5cba00ab','211.54.148.249',1724638623,'__ci_last_regenerate|i:1724638332;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('cce3da76fadb2e3ac2b96e23943d9947cec4a56c','209.38.248.17',1720113978,'__ci_last_regenerate|i:1720113978;'),('cff74ec334c836ca12576ddb461114a4298e8d77','64.225.77.81',1720727289,'__ci_last_regenerate|i:1720727289;'),('d092a75d25f7b50402f6fd07a0f188021bc4e868','165.22.235.3',1722207809,'__ci_last_regenerate|i:1722207809;'),('d0d1da5f8fae83c8bf9aaa784ad5797b963c194a','159.89.12.166',1721809110,'__ci_last_regenerate|i:1721809110;'),('d15dbca67dbe2dd0afe44b8725348a3a766ba739','167.99.189.161',1723093116,'__ci_last_regenerate|i:1723093116;'),('d18ee5da216a9bcda8047dbc022396054432f0e7','207.154.212.47',1722583241,'__ci_last_regenerate|i:1722583241;'),('d21136c508690f8e613e099710531ce0722c0d72','211.54.148.249',1722820959,'__ci_last_regenerate|i:1722820842;ikey|s:3:\"152\";local_cd|s:4:\"KR13\";ul_nm|s:9:\"관리자\";id|s:5:\"admin\";is_login|b:1;ul_uc|s:10:\"KR13-UL-01\";dp_uc|s:10:\"KR13-DP-01\";fa_nm|s:10:\"DroneWorld\";'),('d21d04a9d9f8465f57757861b678f9fadf8b0401','23.239.4.252',1721153710,'__ci_last_regenerate|i:1721153710;'),('d4971f23a23a60dbdd92335793bfe1d858e20904','188.165.87.100',1722266770,'__ci_last_regenerate|i:1722266770;'),('d49d6a27000515f8ef7fa87088ced16c4fe7386f','157.230.19.140',1722044796,'__ci_last_regenerate|i:1722044796;'),('d5b1ad4908fd504cfe75621be36711ec3efd3bad','199.45.154.134',1721959899,'__ci_last_regenerate|i:1721959899;'),('d6156698d1f091cd1666c232e95ab44fe776fc85','64.226.78.121',1723080417,'__ci_last_regenerate|i:1723080417;'),('d7032cc67d601c71b666f3657e86e305fbdbc5c7','192.46.211.230',1722321544,'__ci_last_regenerate|i:1722321544;'),('d76b076af20372e3bf7bb9748a12bc694227e634','209.38.208.202',1722507277,'__ci_last_regenerate|i:1722507277;'),('dbecef98d8e98e6cdf5cefbe36702810d4dcd96a','64.227.32.66',1722339468,'__ci_last_regenerate|i:1722339468;'),('dc840b73c7c6efc3c1e5ca35e4e1d9fb25388dc4','167.172.232.142',1720261183,'__ci_last_regenerate|i:1720261183;'),('dcc214087123507dd7082204beae98996cfd4f63','147.182.149.75',1722614814,'__ci_last_regenerate|i:1722614814;'),('dd82227f69179c43ae3aef29af91cb97f966aa77','64.227.189.240',1723838744,'__ci_last_regenerate|i:1723838744;'),('de2d385cedc045f0f887bbb874b11b0dda417608','64.225.75.246',1723807324,'__ci_last_regenerate|i:1723807324;'),('e0ddbd5e63845718a16fdb7c3bf2cd035755997e','35.171.144.152',1722451444,'__ci_last_regenerate|i:1722451444;'),('e11620f63a2f3b76f06f539ef46699a9cb781008','147.182.129.4',1720901813,'__ci_last_regenerate|i:1720901813;'),('e2a0eafb166e90c13d23d0618f7b4c4f6200e275','205.210.31.41',1723930499,'__ci_last_regenerate|i:1723930499;'),('e2d57957c67743f9026debb6fd8fb336b7ec8650','167.99.189.161',1723093118,'__ci_last_regenerate|i:1723093118;'),('e3315728eca0d13beefbe1cd25f275f9574852a3','95.217.18.177',1720701447,'__ci_last_regenerate|i:1720701447;'),('e38fb5f236f18e923402d9a9ef0cb5de74b5267a','178.254.38.45',1720572512,'__ci_last_regenerate|i:1720572512;'),('e3caadd0ba07c69b6afea945e005ad0f998248ba','3.249.230.45',1722809907,'__ci_last_regenerate|i:1722809907;'),('e3f503e37c46480c1754963a341f092fcfe9968c','62.141.44.236',1721180986,'__ci_last_regenerate|i:1721180986;'),('e4f7f2b29581b103ba0250694261a98dfece316b','207.154.212.47',1724677039,'__ci_last_regenerate|i:1724677039;'),('e6d6506020a2149609536ef72fe3634fddec7617','64.225.77.81',1720727292,'__ci_last_regenerate|i:1720727292;'),('e6d883a82098dae0b3fafa4cda46a6a2c0bb36fe','167.71.81.114',1720982703,'__ci_last_regenerate|i:1720982703;'),('e75532f07130c53afbba6edce159366a6831d467','37.187.215.253',1720972518,'__ci_last_regenerate|i:1720972518;'),('e7cc0ff45dff5e9e9eea1e52346b1546ee211c20','46.101.111.185',1724708969,'__ci_last_regenerate|i:1724708969;'),('e841e1504b0b456943c877373211c1bf7d21c04c','205.169.39.47',1720600811,'__ci_last_regenerate|i:1720600811;'),('e8aa492fbb987ec635927c69ef41b926da5dc856','47.254.76.138',1720615388,'__ci_last_regenerate|i:1720615388;'),('e99799f5372e078ffd456fb2f9bb9b7028e848d5','64.227.32.66',1723625568,'__ci_last_regenerate|i:1723625568;'),('e9af8c53512cb1dc9d4906cb782c5072e5cd9186','3.249.230.45',1722809908,'__ci_last_regenerate|i:1722809908;'),('ea0021e8d662bc23e777fc820c546f3621c36e2e','188.165.87.109',1722267295,'__ci_last_regenerate|i:1722267295;'),('eaaa72e6db5e2f6a03f08bcbb1aef55f24c27380','54.88.179.33',1722451446,'__ci_last_regenerate|i:1722451446;'),('ec39cbf6e6e1b7e1fa5d1e8192763f0e96324a5a','206.189.233.36',1723453656,'__ci_last_regenerate|i:1723453656;'),('ee99473be0e7839e6429964dfa71bd67c14c6eeb','147.182.200.94',1721822990,'__ci_last_regenerate|i:1721822990;'),('eee074745f16135c6834acdcc40a1cce8d52728b','64.227.32.66',1723625559,'__ci_last_regenerate|i:1723625559;'),('eee72a191d3e7f8af905ffd087ebba8ef3d19fcd','24.199.117.114',1724300922,'__ci_last_regenerate|i:1724300922;'),('ef07bad7a21e00cd69feae2c68dcaad3d0e0fcb3','165.22.235.3',1721483381,'__ci_last_regenerate|i:1721483381;'),('f0f4cb0b29aedeccda924e825e44f1d28620cf90','64.74.160.242',1722931751,'__ci_last_regenerate|i:1722931751;'),('f18c4d55b940d273ec0b701148c0bc998279248e','35.171.144.152',1724170757,'__ci_last_regenerate|i:1724170757;'),('f2065bc8be7b9021e6927fc8e0291b4c99cd755b','167.71.81.114',1723617220,'__ci_last_regenerate|i:1723617220;'),('f214049b49ceb39792d18014794bfcf3d8541401','139.59.143.102',1721310795,'__ci_last_regenerate|i:1721310795;'),('f2e4d483d6c57f3c434dcb9dd7dff8d3389cd793','57.128.87.194',1724456409,'__ci_last_regenerate|i:1724456409;'),('f381bb8ddfb6dd7873ecf8dd026ac7195d052745','96.126.110.54',1723978295,'__ci_last_regenerate|i:1723978295;'),('f42dc8a6dc390bd3dc2f33c69539ddddac7ec9df','37.187.215.249',1722274929,'__ci_last_regenerate|i:1722274929;'),('f684169baec872f4e2c643841b9e9a1410452f2f','157.230.19.140',1722044807,'__ci_last_regenerate|i:1722044807;'),('f6d3fac2f78827bc4689b3c7c459bedd8168628d','138.197.135.24',1721869454,'__ci_last_regenerate|i:1721869454;'),('f74bb8a03362453fb1c9a7159b953c92c4815ff9','207.154.212.47',1722583251,'__ci_last_regenerate|i:1722583251;'),('f883b0d634f08fce81408708ce1417e56d1e6564','165.22.235.3',1722177131,'__ci_last_regenerate|i:1722177131;'),('f960328d96e549500e733948a54846cefb71ff78','64.227.189.240',1723838742,'__ci_last_regenerate|i:1723838742;'),('f9ae8839f27abd610a7e5162093f90e88ca97767','209.38.248.17',1720113994,'__ci_last_regenerate|i:1720113994;'),('f9c318a86af8e57d332e0c88abddfccce5c0e657','139.162.155.225',1724341871,'__ci_last_regenerate|i:1724341871;'),('f9c8d6d8c28ad90642d0cb467334a3ad0bdf2a0d','139.162.141.82',1723987553,'__ci_last_regenerate|i:1723987553;'),('fafd7af08017e1f2b202a8978db47c36813e2c68','167.99.189.161',1723093116,'__ci_last_regenerate|i:1723093116;'),('fc33067a303e871592dc9f3735077dfdace5d763','209.38.248.17',1720113971,'__ci_last_regenerate|i:1720113971;'),('fd333878296096b3c5b7f944a152da87df24621e','207.154.212.47',1721985605,'__ci_last_regenerate|i:1721985605;'),('fda0e6a8d721c7161b0c459e45c7b8f4231f8d1d','206.189.233.36',1723453663,'__ci_last_regenerate|i:1723453663;'),('fdabfd096217e0d12cf36d24a23fa425cf50837d','159.65.201.48',1724007656,'__ci_last_regenerate|i:1724007656;'),('fe034734b0e38a5bd1a5e341f89de1e2c3253e1c','164.90.228.79',1720571884,'__ci_last_regenerate|i:1720571884;'),('fe197419fe5b4aa495458937297ab3748d79591f','87.236.176.213',1721017814,'__ci_last_regenerate|i:1721017813;'),('fe7f7543c8f78ec93a52bf95d6ebc710eb5574c3','143.110.217.244',1720606870,'__ci_last_regenerate|i:1720606870;'),('feb676f9e3edbeebdbe257a0231f926161716b0e','139.59.143.102',1720119870,'__ci_last_regenerate|i:1720119870;'),('fee1d7cb06f0f13f7ddb9c16efaa554704c8c829','195.90.221.76',1722404796,'__ci_last_regenerate|i:1722404796;'),('ffbf0d944083e4cd91d772aabee85e9446834265','139.162.155.225',1722804268,'__ci_last_regenerate|i:1722804268;');
/*!40000 ALTER TABLE `ci_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipment` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `main_cd` varchar(50) NOT NULL DEFAULT 'EQ' COMMENT '메인 코드',
  `eq_seq` varchar(50) NOT NULL DEFAULT '01' COMMENT '장비 코드순번',
  `eq_uc` varchar(50) NOT NULL COMMENT '장비 고유 코드(공장코드-메인코드-장비 코드순번 조합)',
  `eq_nm` varchar(255) NOT NULL DEFAULT '' COMMENT '장비명(기계명)',
  `maker` varchar(50) DEFAULT '' COMMENT '장비 메이커명/제조사',
  `model_nm` varchar(50) DEFAULT '' COMMENT '장비 모델명',
  `spec` varchar(50) DEFAULT '' COMMENT '장비 규격',
  `buy_corp` varchar(50) DEFAULT '' COMMENT '구매처',
  `buy_tel` varchar(50) DEFAULT '' COMMENT '구매처 전화번호',
  `buy_dt` date DEFAULT NULL COMMENT '구매일자',
  `amt` float DEFAULT 0 COMMENT '구매금액',
  `serial_no` varchar(50) DEFAULT '' COMMENT '장비 시리얼번호',
  `barcode` varchar(20) DEFAULT '' COMMENT '바코드 번호',
  `print_yn` enum('Y','N') DEFAULT 'N' COMMENT '바코드 출력여부 (N : 미출력 / Y : 출력완료)',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_mc_seq` (`local_cd`,`main_cd`,`eq_seq`) USING BTREE,
  UNIQUE KEY `mc_uc` (`eq_uc`) USING BTREE,
  UNIQUE KEY `local_cd_mc_nm` (`local_cd`,`eq_nm`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='장비 관리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (33,'KR13','EQ','05','KR13-EQ-05','LUGO PRO c_XL 1호기','','','','(주)루고랩스','','2022-09-07',0,'','2022102063370005','Y','FDM\r\n조형 크기\r\n315 * 315 *300 mm\r\n\r\n','N','Y','N','','','','152','1.215.144.226','2022-10-20 10:28:00','152','121.156.13.66','2022-11-16 12:02:38'),(35,'KR13','EQ','06','KR13-EQ-06','LUGO PRO c_XL 2호기','','','','(주)루고랩스','','2022-09-07',0,'','2022111545310006','Y','FDM\r\n조형 크기\r\n315 * 315 *300 mm','N','Y','N','','','','152','121.156.13.66','2022-11-15 15:04:45','152','211.54.148.249','2023-12-22 13:15:19');
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factory_amt_nm`
--

DROP TABLE IF EXISTS `factory_amt_nm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `factory_amt_nm` (
  `ikey` int(11) NOT NULL AUTO_INCREMENT COMMENT 'PK (ikey="1" -> 기본값)',
  `local_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '공장 코드 (z_allips.factory)',
  `amt1` varchar(20) NOT NULL DEFAULT '' COMMENT '단가명1',
  `amt2` varchar(20) DEFAULT '' COMMENT '단가명2',
  `amt3` varchar(20) DEFAULT '' COMMENT '단가명3',
  `amt4` varchar(20) DEFAULT '' COMMENT '단가명4',
  `amt5` varchar(20) NOT NULL DEFAULT '' COMMENT '단가명5',
  `amt6` varchar(20) NOT NULL DEFAULT '' COMMENT '단가명6',
  `amt7` varchar(20) NOT NULL DEFAULT '' COMMENT '단가명7',
  `amt8` varchar(20) NOT NULL DEFAULT '' COMMENT '단가명8',
  `amt9` varchar(20) NOT NULL DEFAULT '' COMMENT '단가명9',
  `amt10` varchar(20) NOT NULL DEFAULT '' COMMENT '단가명10',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y: 사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `reg_ikey` varchar(50) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(50) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일자',
  `mod_ikey` varchar(50) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(50) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일자',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd` (`local_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='- 공장별 등급/단가 명칭 관리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factory_amt_nm`
--

LOCK TABLES `factory_amt_nm` WRITE;
/*!40000 ALTER TABLE `factory_amt_nm` DISABLE KEYS */;
INSERT INTO `factory_amt_nm` VALUES (3,'KR13','판매단가','로얄','골드','VIP','소비자단가','','','','','','N','Y','N','152','1.215.144.226','2022-11-10 14:44:25','','','2022-11-10 14:44:25');
/*!40000 ALTER TABLE `factory_amt_nm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factory_file`
--

DROP TABLE IF EXISTS `factory_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `factory_file` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `file_seq` varchar(50) NOT NULL DEFAULT '01' COMMENT '파일 순번',
  `file_dseq` varchar(50) NOT NULL DEFAULT '1' COMMENT '파일 상세순번',
  `file_orig` varchar(50) NOT NULL DEFAULT '' COMMENT '원본 파일 명',
  `file_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '신규 파일 명',
  `file_path` varchar(255) NOT NULL DEFAULT '' COMMENT '파일 경로(URL)',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_file_seq_file_dseq` (`local_cd`,`file_seq`,`file_dseq`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장 파일 관리 테이블 (리뉴얼 완료)\r\n01: 공장 로고, 02: 질문게시판, 03: 설비 첨부파일';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factory_file`
--

LOCK TABLES `factory_file` WRITE;
/*!40000 ALTER TABLE `factory_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `factory_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flaw`
--

DROP TABLE IF EXISTS `flaw`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flaw` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `main_cd` varchar(50) NOT NULL DEFAULT 'FL' COMMENT '메인 코드',
  `fl_seq` varchar(50) NOT NULL DEFAULT '01' COMMENT '불량 코드순번',
  `fl_uc` varchar(50) NOT NULL COMMENT '불량 고유 코드(공장코드-메인코드-비가동 코드순번 조합)',
  `fl_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '불량 명',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능) (사용안함)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_fl_seq` (`local_cd`,`main_cd`,`fl_seq`) USING BTREE,
  UNIQUE KEY `fl_uc` (`fl_uc`) USING BTREE,
  UNIQUE KEY `local_cd_fl_nm` (`local_cd`,`fl_nm`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장별 불량 유형 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flaw`
--

LOCK TABLES `flaw` WRITE;
/*!40000 ALTER TABLE `flaw` DISABLE KEYS */;
INSERT INTO `flaw` VALUES (16,'KR13','FL','01','KR13-FL-01','파손','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:28:01','','',NULL);
/*!40000 ALTER TABLE `flaw` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday`
--

DROP TABLE IF EXISTS `holiday`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `holiday` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `holiday` date DEFAULT NULL COMMENT '휴무일(년-월-일)',
  `content` varchar(255) DEFAULT '' COMMENT '내용',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') DEFAULT 'N' COMMENT '삭제유무(Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_holiday` (`local_cd`,`holiday`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장 별 휴무일 관리 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday`
--

LOCK TABLES `holiday` WRITE;
/*!40000 ALTER TABLE `holiday` DISABLE KEYS */;
/*!40000 ALTER TABLE `holiday` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_code`
--

DROP TABLE IF EXISTS `item_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_code` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `pm_cd` varchar(20) NOT NULL COMMENT '제품군 코드 (z_plan.prod_master)',
  `pd_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '소속 제품코드 (z_plan.prod_detail)',
  `key_level` varchar(5) NOT NULL DEFAULT '' COMMENT '코드 레벨 (01: 대분류, 02: 추가분류, 03: 옵션코드)',
  `key_parent` varchar(20) DEFAULT '' COMMENT '부모키(부모 ikey)',
  `key_name` varchar(40) DEFAULT '' COMMENT '명칭',
  `unit_amt` decimal(18,4) DEFAULT 0.0000 COMMENT '단가 (옵션에서 추가)',
  `unit` varchar(5) DEFAULT '' COMMENT '기본 계산 공식 (BA/090)',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `etc_4` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조4',
  `etc_5` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조5',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_pm_cd_pd_cd_key_level_key_parent_key_name` (`local_cd`,`pm_cd`,`pd_cd`,`key_level`,`key_parent`,`key_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='기초코드 관리 (대분류(자동완성용)/소분류(자동완성용)/옵션코드 관리)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_code`
--

LOCK TABLES `item_code` WRITE;
/*!40000 ALTER TABLE `item_code` DISABLE KEYS */;
INSERT INTO `item_code` VALUES (44,'KR13','AD','AD01','01','','프로젝트',0.0000,'','','Y','Y','N','','','','','','152','1.215.144.226','2022-11-04 13:09:33','152','211.54.148.249','2023-12-22 13:14:31');
/*!40000 ALTER TABLE `item_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_list`
--

DROP TABLE IF EXISTS `item_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_list` (
  `ikey` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `pm_cd` varchar(50) NOT NULL COMMENT '제품군 코드(z_plan.prod_master.pm_cd)',
  `pd_cd` varchar(50) NOT NULL COMMENT '소속 제품코드(z_plan.prod_detail.pd_cd)',
  `main_cd` enum('S','B') NOT NULL DEFAULT 'S' COMMENT '제품 메인코드 (S: 매출제품, B:원자재(매입 제품), T: 통합 제품)',
  `item_seq` varchar(20) NOT NULL DEFAULT '00001' COMMENT '제품 코드순번',
  `item_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '제품 고유코드(공장코드+소속제품 코드+소속 제품 코드순번 조합)',
  `buy_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '매입처코드(biz_list.cust_cd)',
  `proc_gb` char(1) NOT NULL DEFAULT '1' COMMENT '제작구분 (1:생산제품 / 2:외주제품 / 3:기타제품)',
  `item_gb` char(5) NOT NULL DEFAULT '' COMMENT '제품/자재 유형 (BA/080) [원자재 ~ 상품]',
  `item_lv` varchar(20) NOT NULL DEFAULT '' COMMENT '제품분류 (item_code.ikey)',
  `mfr` varchar(30) DEFAULT '' COMMENT '제조사',
  `taking_weight` varchar(20) DEFAULT '' COMMENT '이륙 증량',
  `self_weight` varchar(20) DEFAULT '' COMMENT '자체 중량',
  `maximum_filght` varchar(20) DEFAULT '' COMMENT '최대 비행시간',
  `maximum_speed` varchar(20) DEFAULT '' COMMENT '최대 속도',
  `Battery` varchar(20) DEFAULT '' COMMENT '배터리',
  `item_nm` varchar(255) NOT NULL DEFAULT '' COMMENT '제품명',
  `size` varchar(50) NOT NULL DEFAULT '' COMMENT '기본 규격',
  `unit` varchar(5) NOT NULL DEFAULT '' COMMENT '단위 (BA/060)',
  `min_size` int(11) NOT NULL DEFAULT 1 COMMENT '최소 주문 수량',
  `spec` longtext DEFAULT '' COMMENT '(제품스펙[JSON])',
  `unit_amt` float unsigned NOT NULL DEFAULT 0 COMMENT '매입단가',
  `sale_amt` float unsigned NOT NULL DEFAULT 0 COMMENT '판매단가',
  `unit_amt_1` float unsigned NOT NULL DEFAULT 0 COMMENT '등급 단가1',
  `unit_amt_2` float unsigned NOT NULL DEFAULT 0 COMMENT '등급 단가2',
  `unit_amt_3` float unsigned NOT NULL DEFAULT 0 COMMENT '등급 단가3',
  `unit_amt_4` float NOT NULL DEFAULT 0 COMMENT '등급 단가4',
  `unit_amt_5` float unsigned NOT NULL DEFAULT 0 COMMENT '등급 단가5',
  `wh_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '기본 창고 (z_plan.warehouse.wh_uc)',
  `safe_qty` float NOT NULL DEFAULT 0 COMMENT '안전 재고',
  `memo` varchar(255) NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y: 사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_pm_cd_pd_cd_main_cd_item_seq` (`local_cd`,`pm_cd`,`pd_cd`,`main_cd`,`item_seq`),
  UNIQUE KEY `item_cd` (`item_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장 별 제품관리 (리뉴얼 완료)\r\n※ spec: maker(제조사), origin(원산지)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_list`
--

LOCK TABLES `item_list` WRITE;
/*!40000 ALTER TABLE `item_list` DISABLE KEYS */;
INSERT INTO `item_list` VALUES (62,'KR13','AD','AD01','B','00001','KR13B00001','','1','004','44','','','','','','','ESS RACK SYSTEM','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'현대 일렉트릭 비콘 하드웨어 개발','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:09:48','152','211.54.148.249','2023-12-18 17:06:29'),(63,'KR13','AD','AD01','B','00002','KR13B00002','','1','004','44','','','','','','','버스형 신발먼지제거기','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:10:02','152','211.54.148.249','2023-12-14 13:45:31'),(64,'KR13','AD','AD01','B','00003','KR13B00003','','1','004','44','','','','','','','가정용 신발먼지제거기','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:10:10','152','211.54.148.249','2023-12-14 13:45:30'),(65,'KR13','AD','AD01','B','00004','KR13B00004','','1','004','44','','','','','','','시각장애인용 물감통','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:10:26','152','211.54.148.249','2023-12-14 13:45:29'),(66,'KR13','AD','AD01','B','00005','KR13B00005','','1','004','44','','','','','','','16mm 커넥터','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:10:33','152','211.54.148.249','2023-12-14 13:45:28'),(67,'KR13','AD','AD01','B','00006','KR13B00006','','1','004','44','','','','','','','FLCC 하우징','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:10:40','152','211.54.148.249','2023-12-14 13:45:26'),(68,'KR13','AD','AD01','B','00007','KR13B00007','','1','004','44','','','','','','','Safety Guard','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:10:51','152','211.54.148.249','2023-12-14 13:45:26'),(69,'KR13','AD','AD01','B','00008','KR13B00008','','1','004','44','','','','','','','Checkered Plate','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:10:59','152','211.54.148.249','2023-12-14 13:45:25'),(70,'KR13','AD','AD01','B','00009','KR13B00009','','1','004','44','','','','','','','낚시용 미끼','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:11:05','152','211.54.148.249','2023-12-14 13:45:24'),(71,'KR13','AD','AD01','B','00010','KR13B00010','','1','004','44','','','','','','','DY파워 마그네트','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:11:12','152','211.54.148.249','2023-12-14 13:45:24'),(72,'KR13','AD','AD01','B','00011','KR13B00011','','1','004','44','','','','','','','영화금속 마그네트','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:11:20','152','211.54.148.249','2023-12-14 13:45:23'),(73,'KR13','AD','AD01','B','00012','KR13B00012','','1','004','44','','','','','','','자전거 잠금장치용 마그네트','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:11:26','152','211.54.148.249','2023-12-14 13:45:23'),(74,'KR13','AD','AD01','B','00013','KR13B00013','','1','004','44','','','','','','','비콘 하드웨어','1','005',1,'{\"maker\":\"\",\"origin\":\"\"}',40000000,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:25:32','152','211.54.148.249','2023-12-14 13:45:22'),(75,'KR13','AD','AD01','B','00014','KR13B00014','','1','004','44','','','','','','','비콘 하드웨어 시제품 제작','1','005',1,'',29000000,29000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:20:13','152','211.54.148.249','2023-12-14 13:45:22'),(76,'KR13','AD','AD01','S','00001','KR13S00001','','1','001','44','','','','','','','ESS RACK SYSTEM 개발','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:41:41','152','211.54.148.249','2023-12-14 13:08:10'),(77,'KR13','AD','AD01','S','00002','KR13S00002','','1','001','44','','','','','','','버스형 신발먼지제거기 개발','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:46:20','152','211.54.148.249','2023-12-14 13:08:10'),(78,'KR13','AD','AD01','S','00003','KR13S00003','','2','001','44','','','','','','','가정용 신발먼지제거기 개발','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:46:44','152','211.54.148.249','2023-12-14 13:08:09'),(79,'KR13','AD','AD01','S','00004','KR13S00004','','1','001','44','','','','','','','시각장애인용 물감통 개발','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:46:53','152','211.54.148.249','2023-12-14 13:08:08'),(80,'KR13','AD','AD01','S','00005','KR13S00005','','1','001','44','','','','','','','16mm 커넥터 개발','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:47:02','152','211.54.148.249','2023-12-14 13:08:08'),(81,'KR13','AD','AD01','S','00006','KR13S00006','','1','001','44','','','','','','','FLCC 하우징 제작','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:47:10','152','211.54.148.249','2023-12-14 13:08:08'),(82,'KR13','AD','AD01','S','00007','KR13S00007','','1','001','44','','','','','','','Safety Guard 개발 및 제작','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:47:23','152','211.54.148.249','2023-12-14 13:08:07'),(83,'KR13','AD','AD01','S','00008','KR13S00008','','1','001','44','','','','','','','Checkered Plate 개발 및 제작','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:47:33','152','211.54.148.249','2023-12-14 13:08:06'),(84,'KR13','AD','AD01','S','00009','KR13S00009','','1','001','44','','','','','','','낚시용 미끼 시제품 제작','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','Y','N','N','','','','152','1.215.144.226','2022-11-11 09:47:51','152','211.54.148.249','2023-12-14 13:08:05'),(85,'KR13','AD','AD01','S','00010','KR13S00010','','1','001','44','','','','','','','DY파워 마그네트 개발 및 제작','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:48:01','152','211.54.148.249','2023-12-14 13:08:05'),(86,'KR13','AD','AD01','S','00011','KR13S00011','','1','001','44','','','','','','','영화금속 마그네트 개발 및 제작','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:48:11','152','211.54.148.249','2023-12-14 13:08:05'),(87,'KR13','AD','AD01','S','00012','KR13S00012','','1','001','44','','','','','','','자전거 잠금장치용 마그네트 개발 및 제작','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:48:21','152','211.54.148.249','2023-12-14 13:08:04'),(88,'KR13','AD','AD01','S','00013','KR13S00013','','1','001','44','','','','','','','비콘 하드웨어 개발','1','005',1,'',0,40000000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','1.215.144.226','2022-11-11 09:48:31','152','211.54.148.249','2023-12-14 13:08:03'),(89,'KR13','AD','AD01','S','00014','KR13S00014','','1','001','44','','','','','','','smile egi 11.16','1','005',1,'',0,8500,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','121.156.13.66','2022-11-16 13:53:23','152','211.54.148.249','2023-12-14 13:08:03'),(90,'KR13','AD','AD01','S','00015','KR13S00015','','1','001','44','','','','','','','HD540PRO','2150*2080*930','005',1,'',0,900000,0,0,0,0,0,'KR13-WH-01',0,'이륙중량 : 88KG\r\n자체중량 : 48KG\r\n최대비행시간 : 20분\r\n최대속도 : 10m/s\r\n제작일 : 2023년 03월\r\n배터리 : 30,000mAh / Li-po, 18cell','N','Y','N','','','','152','211.54.148.249','2023-12-14 13:11:55','152','211.54.148.249','2023-12-14 16:14:48'),(91,'KR13','AD','AD01','S','00016','KR13S00016','','1','002','44','','','','','','','112','123','005',11,'',10000,10000,0,0,0,0,0,'KR13-WH-01',0,'','N','N','N','','','','152','211.54.148.249','2023-12-15 10:40:30','152','211.54.148.249','2023-12-15 10:42:55'),(92,'KR13','AD','AD01','S','00017','KR13S00017','','1','002','44','','','','','','','11414','23','005',1231,'',10000,10000,0,0,0,0,0,'KR13-WH-01',1231,'231','N','Y','N','','','','152','211.54.148.249','2023-12-15 11:32:42','','',NULL),(93,'KR13','AD','AD01','S','00018','KR13S00018','','1','002','44','2323d','2323','2323','1313','1414','1,414','14141','123123','005',1,'',10000,10000,0,0,0,0,0,'KR13-WH-01',0,'','N','Y','N','','','','152','211.54.148.249','2023-12-15 13:06:49','152','211.54.148.249','2023-12-15 13:23:55'),(94,'KR13','AD','AD01','S','00019','KR13S00019','','1','002','44','제조사','이륙','자체','비행','속도','배터리','제품명123','120*15','005',1,'',10000,10000,0,0,0,0,0,'KR13-WH-01',0,'','N','Y','N','','','','152','211.54.148.249','2023-12-15 17:03:35','','',NULL),(95,'KR13','AD','AD01','S','00020','KR13S00020','','1','002','44','123','141','144','1414','1414','4141','테스트','1','012',1,'',10000,10000,0,0,0,0,0,'KR13-WH-01',0,'11','N','Y','N','','','','152','211.54.148.249','2023-12-16 19:34:33','152','221.152.160.85','2023-12-17 14:57:00'),(96,'KR13','AD','AD01','S','00021','KR13S00021','','1','001','44','제조사','이륙증강','자체증량','최대비행시간','최대속도','','HD540PRO2','300*110*2540','005',1,'',0,10000,0,0,0,0,0,'KR13-WH-01',0,'','N','Y','N','','','','152','211.54.148.249','2023-12-18 09:13:15','152','211.54.148.249','2023-12-18 09:13:49'),(97,'KR13','AD','AD01','S','00022','KR13S00022','','1','001','44','123','123','123','123','123','123','01','250','005',1,'',0,10000,0,0,0,0,0,'KR13-WH-01',0,'','N','Y','N','','','','152','211.54.148.249','2023-12-18 17:05:17','','',NULL),(98,'KR13','AD','AD01','S','00023','KR13S00023','','1','001','44','12','123','1234','12345','123456','1234567','02','250','005',1,'',0,10000,0,0,0,0,0,'KR13-WH-01',0,'','N','Y','N','','','','152','211.54.148.249','2023-12-19 17:30:54','','',NULL),(99,'KR13','AD','AD01','B','00015','KR13B00015','','1','004','44','','','','','','','04','250','018',1,'{\"maker\":\"\",\"origin\":\"\"}',10000,0,0,0,0,0,0,'KR13-WH-01',0,'','Y','Y','N','','','','152','211.54.148.249','2023-12-19 17:31:25','152','211.54.148.249','2023-12-22 13:14:48'),(100,'KR13','AD','AD01','S','00024','KR13S00024','','1','001','44','제조사','2KG','4KG','2시간','30KM/s','30,000','HD540PRO3','250*100*300','005',1,'',0,10000,0,0,0,0,0,'KR13-WH-01',0,'','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:13:55','','',NULL),(101,'KR13','AD','AD01','B','00016','KR13B00016','','1','004','44','','','','','','','테스트 원자재','400','018',1,'{\"maker\":\"제조사\",\"origin\":\"원산지\"}',10000,0,0,0,0,0,0,'KR13-WH-01',0,'','Y','Y','N','','','','152','211.54.148.249','2023-12-22 13:14:31','152','211.54.148.249','2023-12-22 13:16:36');
/*!40000 ALTER TABLE `item_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_price`
--

DROP TABLE IF EXISTS `item_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_price` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 코드',
  `item_cd` varchar(20) NOT NULL COMMENT '제품 코드',
  `unit_amt` decimal(18,4) NOT NULL DEFAULT 0.0000 COMMENT '개별 단가',
  `unit` varchar(5) NOT NULL DEFAULT '001' COMMENT '금액 단위 (BA/070)',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고3',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_cust_cd_item_cd` (`local_cd`,`cust_cd`,`item_cd`) USING BTREE,
  KEY `FK_item_price_biz_list` (`cust_cd`) USING BTREE,
  KEY `FK_item_price_item_list` (`item_cd`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장 거래처 별 개별 단가관리 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_price`
--

LOCK TABLES `item_price` WRITE;
/*!40000 ALTER TABLE `item_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_sub`
--

DROP TABLE IF EXISTS `item_sub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_sub` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_allips.factory)',
  `item_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '제품 코드 (item_list.item_cd)',
  `sub_nm_01` varchar(20) DEFAULT '' COMMENT '추가분류 명칭1',
  `sub_nm_02` varchar(20) DEFAULT '' COMMENT '추가분류 명칭2',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `item_cd_sub_nm_01_sub_nm_02` (`item_cd`,`sub_nm_01`,`sub_nm_02`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='기초코드 관리2 (소분류/추가분류 관리)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_sub`
--

LOCK TABLES `item_sub` WRITE;
/*!40000 ALTER TABLE `item_sub` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_sub` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_detail`
--

DROP TABLE IF EXISTS `job_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_detail` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `job_no` varchar(20) NOT NULL COMMENT '제조 오더 번호 (job_master.job_no)',
  `lot` varchar(50) DEFAULT '' COMMENT '작업 로트 (제조오더번호+3자리 순번 조합)',
  `pc_uc` varchar(20) DEFAULT '' COMMENT '라우터 고유 코드 (z_plan.proc_master)',
  `pp_uc` varchar(20) DEFAULT '' COMMENT '공정 고유 코드 (z_plan.proc_detail)',
  `pp_nm` varchar(20) DEFAULT '' COMMENT '공정 명',
  `pp_seq` int(11) DEFAULT 1 COMMENT '공정 순서',
  `pp_hisyn` enum('Y','N') DEFAULT 'N' COMMENT '실적 사용여부',
  `plan_cnt` int(11) DEFAULT 0 COMMENT '목표 실적량',
  `plan_time` int(11) DEFAULT 0 COMMENT '일 작업시간',
  `plan_num` int(11) DEFAULT 0 COMMENT '투입 인원수',
  `ul_uc` varchar(20) DEFAULT '' COMMENT '작업담당자 고유 코드 (z_plan.user_list)',
  `ul_nm` varchar(20) DEFAULT '' COMMENT '담당자 명',
  `job_id` varchar(20) DEFAULT '' COMMENT '제조자 아이디',
  `job_pw` varchar(20) DEFAULT '' COMMENT '제조자 비밀번호',
  `con_nm` varchar(20) DEFAULT '' COMMENT '조종기 관리번호',
  `job_st` enum('N','P','F','S') DEFAULT 'N' COMMENT '작업 상태 (N: 대기, P: 진행, F: 완료, S:가동 중단(비가동))',
  `start_dt` datetime DEFAULT NULL COMMENT '작업 시작일시',
  `end_dt` datetime DEFAULT NULL COMMENT '작업 완료일시',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `lot` (`lot`),
  KEY `FK_job_detail_job_master` (`job_no`),
  CONSTRAINT `FK_job_detail_job_master` FOREIGN KEY (`job_no`) REFERENCES `job_master` (`job_no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=362 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='제조오더 상세 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_detail`
--

LOCK TABLES `job_detail` WRITE;
/*!40000 ALTER TABLE `job_detail` DISABLE KEYS */;
INSERT INTO `job_detail` VALUES (258,'KR13','2023121447956','2023121447956001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',11,10,8,'KR13-UL-02','관리자','','','','F',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 14:23:14','','',NULL),(259,'KR13','5100D007','5100D007001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,20,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:29:02','','',NULL),(260,'KR13','5158D0D5','5158D0D5001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',10,8,2,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:35:13','','',NULL),(261,'KR13','5158D0A2','5158D0A2001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,20,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:37:39','','',NULL),(262,'KR13','5158D0BA','5158D0BA001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,10,8,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:37:58','','',NULL),(263,'KR13','5158D1CF','5158D1CF001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,10,8,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:38:33','','',NULL),(264,'KR13','5158D0A4','5158D0A4001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:39:05','','',NULL),(265,'KR13','5158D087','5158D087001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:39:30','','',NULL),(266,'KR13','5158D03B','5158D03B001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:39:57','','',NULL),(267,'KR13','5158D03A','5158D03A001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:40:25','','',NULL),(268,'KR13','5158D0A0','5158D0A0001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:42:44','','',NULL),(269,'KR13','5158D1D0','5158D1D0001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:43:27','','',NULL),(270,'KR13','5158D0BC','5158D0BC001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:43:45','','',NULL),(271,'KR13','5158D0D9','5158D0D9001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:44:13','','',NULL),(272,'KR13','5158D0DA','5158D0DA001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:44:34','','',NULL),(273,'KR13','5158D042','5158D042001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:44:57','','',NULL),(274,'KR13','5158D0BB','5158D0BB001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:45:15','','',NULL),(275,'KR13','5158D1D4','5158D1D4001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:45:32','','',NULL),(276,'KR13','5158D03E','5158D03E001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:45:49','','',NULL),(277,'KR13','5158D0D6','5158D0D6001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 17:46:05','','',NULL),(279,'KR13','5158D118','5158D118001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,8,10,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-14 18:20:07','152','211.54.148.249','2023-12-14 18:20:07'),(286,'KR13','14141','14141001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,1,1,'KR13-UL-02','관리자','14124123','$2y$10$3sJODIV.mKgbb','24124123','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-15 10:06:16','152','211.54.148.249','2023-12-15 10:06:16'),(287,'KR13','fff1123','fff1123001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,1,1,'KR13-UL-02','관리자','asdasd','zxasqw1','asdasdasd','N',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-15 17:04:27','','',NULL),(288,'KR13','','001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',5,10,8,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-18 09:21:57','','',NULL),(289,'KR13','01233','01233001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,1,1,'KR13-UL-02','관리자','010456','010123','010233','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-18 17:07:14','','',NULL),(290,'KR13','012222','012222001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',2,1,1,'KR13-UL-02','관리자','014567','01223','01456','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-18 17:09:01','','',NULL),(291,'KR13','4455','4455001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',2,1,1,'KR13-UL-02','관리자','8855','4466','7799','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-19 17:34:53','','',NULL),(292,'KR13','46231','46231001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',1,1,1,'KR13-UL-02','관리자','444888','15123','11516','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-20 14:40:07','','',NULL),(293,'KR13','12220118','12220118001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',1,10,2,'KR13-UL-02','관리자','20221222#','20221222!','20221222@','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:19:04','','',NULL),(294,'KR13','DW1217','DW1217001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',32,8,5,'KR13-UL-02','관리자','D11234G','D11234','!D11234','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-27 10:47:10','','',NULL),(295,'KR13','DW1222','DW1222001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',42,8,6,'KR13-UL-02','관리자','','!DW1222','@DW1222','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-27 10:50:31','','',NULL),(296,'KR13','DW1226','DW1226001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',45,8,6,'KR13-UL-02','관리자','','!DW1226','@DW1226','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-27 10:51:22','','',NULL),(297,'KR13','DW1214','DW1214001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',35,8,5,'KR13-UL-02','관리자','DW1214!','!DW1214','@DW1214','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2023-12-27 11:02:30','','',NULL),(298,'KR13','HD20231218','HD20231218001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',15,8,1,'KR13-UL-02','관리자','d20231218','!20231218','20231218','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-01-02 17:39:26','','',NULL),(299,'KR13','HD20231229','HD20231229001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',15,8,1,'KR13-UL-02','관리자','d20231229','20231229','!HD20231229','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-01-02 17:40:46','','',NULL),(301,'KR13','HD20240102','HD20240102001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',15,8,1,'KR13-UL-02','관리자','d20240102','20240102','!HD20240102','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-01-02 17:45:53','152','211.54.148.249','2024-01-02 17:45:53'),(302,'KR13','HD20240226','HD20240226001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',15,8,1,'KR13-UL-02','관리자','d20240226','20240226','!HD20240226','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-04 17:15:59','','',NULL),(303,'KR13','HD20240227','HD20240227001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',20,8,1,'KR13-UL-02','관리자','d20240227','20240227','!HD20240227','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-04 17:16:54','','',NULL),(304,'KR13','HD20240228','HD20240228001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',19,8,1,'KR13-UL-02','관리자','d20240228','20240228','!HD20240228','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-04 17:17:33','','',NULL),(305,'KR13','HD20240229','HD20240229001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',25,8,1,'KR13-UL-02','관리자','d20240229','20240229','!HD20240229','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-04 17:18:06','','',NULL),(306,'KR13','HD20240304','HD20240304001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',31,8,1,'KR13-UL-02','관리자','d20240304','20240304','!HD20240304','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-04 17:18:52','','',NULL),(307,'KR13','HD20240305','HD20240305001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',29,8,1,'KR13-UL-02','관리자','d20240305','20240305','!HD20240305','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-05 13:06:15','','',NULL),(308,'KR13','HD20240306','HD20240306001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',25,8,1,'KR13-UL-02','관리자','d20240306','20240306','!HD20240306','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-06 11:47:50','','',NULL),(309,'KR13','HD20240307','HD20240307001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',28,8,1,'KR13-UL-02','관리자','d20240307','20240307','!HD20240307','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-08 12:05:50','','',NULL),(310,'KR13','HD20240308','HD20240308001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',34,8,1,'KR13-UL-02','관리자','d20240308','20240308','!HD20240308','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-08 12:06:13','','',NULL),(312,'KR13','HD20240311','HD20240311001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',29,8,1,'KR13-UL-02','관리자','d20240311','20240311','!HD20240311','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-11 16:49:12','152','119.198.166.243','2024-03-11 16:49:12'),(313,'KR13','HD20240312','HD20240312001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',28,8,1,'KR13-UL-02','관리자','d20240312','20240312','!HD20240312','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-12 11:31:22','','',NULL),(314,'KR13','HD20240313','HD20240313001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',25,8,1,'KR13-UL-02','관리자','d20240313','20240313','!HD20240313','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-13 12:21:35','','',NULL),(315,'KR13','HD20240314','HD20240314001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',30,8,1,'KR13-UL-02','관리자','d20240314','20240314','!HD20240314','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-15 01:15:39','','',NULL),(316,'KR13','HD20240315','HD20240315001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',24,8,1,'KR13-UL-02','관리자','d20240315','20240315','!HD20240315','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-15 01:16:15','','',NULL),(317,'KR13','HD20240318','HD20240318001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',25,8,1,'KR13-UL-02','관리자','d20240318','20240318','!HD20240318','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-18 02:03:42','','',NULL),(318,'KR13','HD20240319','HD20240319001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',30,8,1,'KR13-UL-02','관리자','d20240319','20240319','!HD20240319','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-19 11:58:08','','',NULL),(319,'KR13','HD20240320','HD20240320001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',32,8,1,'KR13-UL-02','관리자','d20240320','20240320','!HD20240320','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-20 00:28:32','','',NULL),(320,'KR13','HD20240321','HD20240321001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',28,8,1,'KR13-UL-02','관리자','d20240321','20240321','!HD20240321','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-21 11:33:41','','',NULL),(321,'KR13','HD20240322','HD20240322001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',25,8,1,'KR13-UL-02','관리자','d20240322','20240322','!HD20240322','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-25 15:43:27','','',NULL),(322,'KR13','HD20240325','HD20240325001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',18,8,1,'KR13-UL-02','관리자','d20240325','20240325','!HD20240325','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-25 15:43:53','','',NULL),(323,'KR13','HD20240326','HD20240326001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',20,8,1,'KR13-UL-02','관리자','d20240326','20240326','!HD20240326','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-26 15:43:17','','',NULL),(324,'KR13','HD20240327','HD20240327001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',23,8,1,'KR13-UL-02','관리자','d20240327','20240327','!HD20240327','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-27 19:38:59','','',NULL),(325,'KR13','HD20240328','HD20240328001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',22,8,1,'KR13-UL-02','관리자','d20240328','20240328','!HD20240328','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-28 13:51:01','','',NULL),(326,'KR13','HD20240329','HD20240329001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',23,8,1,'KR13-UL-02','관리자','d20240329','20240329','!HD20240329','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-03-29 10:04:51','','',NULL),(327,'KR13','HD20240401','HD20240401001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',22,8,1,'KR13-UL-02','관리자','d20240401','20240401','!HD20240401','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-01 11:06:56','','',NULL),(328,'KR13','HD20240402','HD20240402001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',30,8,1,'KR13-UL-02','관리자','d20240402','20240402','!HD20240402','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-02 19:07:36','','',NULL),(329,'KR13','HD20240403','HD20240403001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',35,8,1,'KR13-UL-02','관리자','d20240403','20240403','!HD20240403','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-04 12:05:40','','',NULL),(330,'KR13','HD20240404','HD20240404001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',38,8,1,'KR13-UL-02','관리자','d20240404','20240404','!HD20240404','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-04 12:06:06','','',NULL),(331,'KR13','HD20240405','HD20240405001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',30,8,1,'KR13-UL-02','관리자','d20240405','20240405','!HD20240405','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-08 01:03:51','','',NULL),(332,'KR13','HD20240408','HD20240408001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',37,8,1,'KR13-UL-02','관리자','d20240408','20240408','!HD20240408','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-08 01:06:30','','',NULL),(333,'KR13','HD20240409','HD20240409001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',33,8,1,'KR13-UL-02','관리자','d20240409','20240409','!HD20240409','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-09 17:39:54','','',NULL),(334,'KR13','HD20240411','HD20240411001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',31,8,1,'KR13-UL-02','관리자','d20240411','20240411','!HD20240411','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-12 10:55:20','','',NULL),(335,'KR13','HD20240412','HD20240412001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',35,8,1,'KR13-UL-02','관리자','d20240412','20240412','!HD20240412','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-12 10:56:24','','',NULL),(336,'KR13','HD20240415','HD20240415001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',33,8,1,'KR13-UL-02','관리자','d20240415','20240415','!HD20240415','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-16 13:33:37','','',NULL),(337,'KR13','HD20240416','HD20240416001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',41,8,1,'KR13-UL-02','관리자','d20240416','20240416','!HD20240416','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-16 13:34:07','','',NULL),(338,'KR13','HD20240417','HD20240417001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',33,8,1,'KR13-UL-02','관리자','d20240417','20240417','!HD20240417','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-18 02:00:18','','',NULL),(339,'KR13','HD20240418','HD20240418001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',39,8,1,'KR13-UL-02','관리자','d20240418','20240418','!HD20240418','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-18 02:00:43','','',NULL),(340,'KR13','HD20240419','HD20240419001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',33,8,1,'KR13-UL-02','관리자','d20240419','20240419','!HD20240419','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-22 01:02:51','','',NULL),(341,'KR13','HD20240422','HD20240422001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',33,8,1,'KR13-UL-02','관리자','d20240422','20240422','!HD20240422','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-22 01:03:20','','',NULL),(342,'KR13','HD20240423','HD20240423001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',30,8,1,'KR13-UL-02','관리자','d20240423','20240423','!HD20240423','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-23 11:27:55','','',NULL),(343,'KR13','HD20240424','HD20240424001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',25,8,1,'KR13-UL-02','관리자','d20240424','20240424','!HD20240424','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-24 01:52:53','','',NULL),(344,'KR13','HD20240425','HD20240425001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',31,8,1,'KR13-UL-02','관리자','d20240425','20240425','!HD20240425','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-25 00:24:48','','',NULL),(345,'KR13','HD20240426','HD20240426001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',40,8,1,'KR13-UL-02','관리자','d20240426','20240426','!HD20240426','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-26 12:23:33','','',NULL),(346,'KR13','HD20240429','HD20240429001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',30,8,1,'KR13-UL-02','관리자','d20240429','20240429','!HD20240429','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-30 00:49:15','','',NULL),(347,'KR13','HD20240430','HD20240430001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',28,8,1,'KR13-UL-02','관리자','d20240430','20240430','!HD20240430','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-04-30 00:49:41','','',NULL),(348,'KR13','HD20240502','HD20240502001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',33,8,1,'KR13-UL-02','관리자','d20240502','20240502','!HD20240502','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-05-02 19:12:17','','',NULL),(349,'KR13','HD20240503','HD20240503001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',39,8,1,'KR13-UL-02','관리자','d20240503','20240503','!HD20240503','P',NULL,NULL,'','N','Y','N','','','','152','119.198.166.243','2024-05-03 01:14:38','','',NULL),(350,'KR13','20240724R','20240724R001','KR13-PC-03','KR13-PP-03','드론 제조 12/22',1,'Y',35,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-07-24 09:27:47','','',NULL),(351,'KR13','20240725R','20240725R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',32,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-07-25 11:50:01','','',NULL),(352,'KR13','20240730R','20240730R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',31,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-07-30 10:01:02','','',NULL),(353,'KR13','20240731R','20240731R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',33,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-07-31 11:21:46','','',NULL),(354,'KR13','20240801R','20240801R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',30,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-08-01 13:34:34','','',NULL),(355,'KR13','20240805R','20240805R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',31,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-08-05 10:22:29','','',NULL),(356,'KR13','20240806R','20240806R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',35,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-08-06 09:12:58','','',NULL),(357,'KR13','20240808R','20240808R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',35,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-08-08 10:04:49','','',NULL),(358,'KR13','20240813R','20240813R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',32,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-08-13 09:11:20','','',NULL),(359,'KR13','20240819R','20240819R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',30,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-08-19 13:21:06','','',NULL),(360,'KR13','20240821R','20240821R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',33,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-08-21 09:36:02','','',NULL),(361,'KR13','20240823R','20240823R001','KR13-PC-02','KR13-PP-02','드론 제조',1,'Y',32,8,1,'KR13-UL-02','관리자','','','','P',NULL,NULL,'','N','Y','N','','','','152','211.54.148.249','2024-08-23 16:31:12','','',NULL);
/*!40000 ALTER TABLE `job_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_master`
--

DROP TABLE IF EXISTS `job_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_master` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `job_no` varchar(20) NOT NULL COMMENT '제조 오더 번호 (등록일자+난수 5자리 조합)',
  `job_dt` date DEFAULT NULL COMMENT '지시 일자',
  `item_cd` varchar(20) DEFAULT '' COMMENT '제품 코드 (item_list.item_cd)',
  `item_nm` varchar(20) DEFAULT '' COMMENT '제품 명',
  `spec` longtext DEFAULT '' COMMENT '상세 스펙 (규격/단위/분할) [JSON]',
  `wp_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '작업장 고유 코드 (z_plan.work_place)',
  `job_qty` int(11) DEFAULT 0 COMMENT '지시 수량',
  `unit_amt` float NOT NULL DEFAULT 0 COMMENT '기준 단가 (1EA당 생산단가 = BOM 소요량의 합)',
  `fac_text` mediumtext NOT NULL DEFAULT '' COMMENT '공장 지시',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `state` varchar(5) DEFAULT '001' COMMENT '진행 상태 (PR/090)',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `job_id` varchar(20) DEFAULT NULL COMMENT '제조자 아이디',
  `job_pw` varchar(20) DEFAULT NULL COMMENT '제조자 비밀번호',
  `con_nm` varchar(20) DEFAULT NULL COMMENT '조종기 관리번호',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `job_no` (`job_no`)
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='제조오더 마스터 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_master`
--

LOCK TABLES `job_master` WRITE;
/*!40000 ALTER TABLE `job_master` DISABLE KEYS */;
INSERT INTO `job_master` VALUES (67,'KR13','2023121447956','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"012\"}','KR13-WP-01',11,40000000,'','','003','Y',NULL,NULL,NULL,'N','N','','','','','','2023-12-14 14:23:14','152','211.54.148.249','2023-12-14 14:23:32'),(68,'KR13','5100D007','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:29:02','','',NULL),(69,'KR13','5158D0D5','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:35:13','','',NULL),(70,'KR13','5158D0A2','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:37:39','','',NULL),(71,'KR13','5158D0BA','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:37:58','','',NULL),(72,'KR13','5158D1CF','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:38:33','','',NULL),(73,'KR13','5158D0A4','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:39:05','','',NULL),(74,'KR13','5158D087','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:39:30','','',NULL),(75,'KR13','5158D03B','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:39:57','','',NULL),(76,'KR13','5158D03A','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:40:25','','',NULL),(77,'KR13','5158D0A0','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:42:44','','',NULL),(78,'KR13','5158D1D0','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:43:27','','',NULL),(79,'KR13','5158D0BC','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:43:45','','',NULL),(80,'KR13','5158D0D9','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:44:13','','',NULL),(81,'KR13','5158D0DA','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:44:34','','',NULL),(82,'KR13','5158D042','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:44:57','','',NULL),(83,'KR13','5158D0BB','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:45:15','','',NULL),(84,'KR13','5158D1D4','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:45:32','','',NULL),(85,'KR13','5158D03E','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:45:49','','',NULL),(86,'KR13','5158D0D6','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:46:05','','',NULL),(87,'KR13','5158D118','2023-12-14','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','003','Y',NULL,NULL,NULL,'Y','N','','','','','','2023-12-14 17:46:22','152','211.54.148.249','2023-12-14 18:24:38'),(93,'KR13','14141','2023-12-15','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N','14124123','$2y$10$3sJODIV.mKgbb','24124123','Y','N','','','','','','2023-12-15 09:38:43','','',NULL),(94,'KR13','fff1123','2023-12-15','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','001','N','asdasd','zxasqw1','asdasdasd','Y','N','','','','','','2023-12-15 17:04:27','','',NULL),(95,'KR13','','2023-11-07','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',5,40000000,'','','003','Y','','','','Y','N','','','','','','2023-12-18 09:21:57','152','211.54.148.249','2023-12-18 09:22:21'),(96,'KR13','01233','2023-12-18','KR13S00022','01','{\"size\":\"250\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','','003','N','010456','010123','010233','Y','N','','','','','','2023-12-18 17:07:14','','',NULL),(97,'KR13','012222','2023-12-18','KR13S00022','01','{\"size\":\"250\",\"unit\":\"005\"}','KR13-WP-01',2,40000000,'','','003','Y','014567','01223','01456','Y','N','','','','','','2023-12-18 17:09:01','152','211.54.148.249','2023-12-18 17:09:06'),(98,'KR13','4455','2023-12-19','KR13S00023','02','{\"size\":\"250\",\"unit\":\"005\"}','KR13-WP-01',1,10000,'','','003','Y','8855','4466','7799','Y','N','','','','','','2023-12-19 17:34:53','152','211.54.148.249','2023-12-19 17:35:00'),(99,'KR13','46231','2023-12-20','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',1,40000000,'','1546','003','Y','444888','15123','11516','Y','N','','','','','','2023-12-20 14:40:07','152','211.54.148.249','2023-12-20 14:40:16'),(100,'KR13','12220118','2023-12-22','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',1,10000,'','','003','Y','20221222#','20221222!','20221222@','Y','N','','','','','','2023-12-22 13:19:04','152','211.54.148.249','2023-12-22 13:19:19'),(101,'KR13','DW1217','2023-12-05','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',32,40000000,'','','003','Y','D11234G','D11234','!D11234','Y','N','','','','','','2023-12-27 10:47:10','152','211.54.148.249','2023-12-27 11:00:26'),(102,'KR13','DW1222','2023-12-22','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',42,40000000,'','','003','Y','','!DW1222','@DW1222','Y','N','','','','','','2023-12-27 10:50:31','152','211.54.148.249','2023-12-27 10:53:04'),(103,'KR13','DW1226','2023-12-27','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',45,40000000,'','','003','Y','','!DW1226','@DW1226','Y','N','','','','','','2023-12-27 10:51:22','152','211.54.148.249','2023-12-27 10:53:04'),(104,'KR13','DW1214','2023-12-14','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',35,10000,'','','003','Y','DW1214!','!DW1214','@DW1214','Y','N','','','','','','2023-12-27 11:02:30','152','211.54.148.249','2023-12-27 11:02:42'),(105,'KR13','HD20231218','2023-12-28','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',15,10000,'','','003','Y','d20231218','!20231218','20231218','Y','N','','','','','','2024-01-02 17:39:26','152','211.54.148.249','2024-01-02 17:40:56'),(106,'KR13','HD20231229','2023-12-29','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',15,10000,'','','003','Y','d20231229','20231229','!HD20231229','Y','N','','','','','','2024-01-02 17:40:46','152','211.54.148.249','2024-01-02 17:40:56'),(107,'KR13','HD20240102','2024-01-02','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240102','20240102','!HD20240102','Y','N','','','','','','2024-01-02 17:45:28','152','211.54.148.249','2024-01-02 17:45:59'),(108,'KR13','HD20240226','2024-02-26','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240226','20240226','!HD20240226','Y','N','','','','','','2024-03-04 17:15:59','152','119.198.166.243','2024-03-04 17:19:06'),(109,'KR13','HD20240227','2024-02-27','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',23,10000,'','','003','Y','d20240227','20240227','!HD20240227','Y','N','','','','','','2024-03-04 17:16:54','152','119.198.166.243','2024-03-04 17:19:06'),(110,'KR13','HD20240228','2024-02-28','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',19,10000,'','','003','Y','d20240228','20240228','!HD20240228','Y','N','','','','','','2024-03-04 17:17:33','152','119.198.166.243','2024-03-04 17:19:06'),(111,'KR13','HD20240229','2024-02-29','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',25,10000,'','','003','Y','d20240229','20240229','!HD20240229','Y','N','','','','','','2024-03-04 17:18:06','152','119.198.166.243','2024-03-04 17:19:06'),(112,'KR13','HD20240304','2024-03-04','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',31,10000,'','','003','Y','d20240304','20240304','!HD20240304','Y','N','','','','','','2024-03-04 17:18:52','152','119.198.166.243','2024-03-04 17:19:06'),(113,'KR13','HD20240305','2024-03-05','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',29,10000,'','','003','Y','d20240305','20240305','!HD20240305','Y','N','','','','','','2024-03-05 13:06:15','152','119.198.166.243','2024-03-05 13:06:21'),(114,'KR13','HD20240306','2024-03-06','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',25,10000,'','','003','Y','d20240306','20240306','!HD20240306','Y','N','','','','','','2024-03-06 11:47:50','152','119.198.166.243','2024-03-06 11:47:54'),(115,'KR13','HD20240307','2024-03-07','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',28,10000,'','','003','Y','d20240307','20240307','!HD20240307','Y','N','','','','','','2024-03-08 12:05:50','152','119.198.166.243','2024-03-08 12:06:19'),(116,'KR13','HD20240308','2024-03-07','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',34,10000,'','','003','Y','d20240308','20240308','!HD20240308','Y','N','','','','','','2024-03-08 12:06:13','152','119.198.166.243','2024-03-08 12:06:19'),(117,'KR13','HD20240311','2024-03-11','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',34,10000,'','','003','Y','d20240311','20240311','!HD20240311','Y','N','','','','','','2024-03-11 16:49:03','152','119.198.166.243','2024-03-11 16:49:30'),(118,'KR13','HD20240312','2024-03-12','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',28,10000,'','','003','Y','d20240312','20240312','!HD20240312','Y','N','','','','','','2024-03-12 11:31:22','152','119.198.166.243','2024-03-12 11:31:26'),(119,'KR13','HD20240313','2024-03-13','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',25,10000,'','','003','Y','d20240313','20240313','!HD20240313','Y','N','','','','','','2024-03-13 12:21:35','152','119.198.166.243','2024-03-13 12:21:40'),(120,'KR13','HD20240314','2024-03-14','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240314','20240314','!HD20240314','Y','N','','','','','','2024-03-15 01:15:39','152','119.198.166.243','2024-03-15 01:16:20'),(121,'KR13','HD20240315','2024-03-15','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',24,10000,'','','003','Y','d20240315','20240315','!HD20240315','Y','N','','','','','','2024-03-15 01:16:15','152','119.198.166.243','2024-03-15 01:16:20'),(122,'KR13','HD20240318','2024-03-18','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',25,10000,'','','003','Y','d20240318','20240318','!HD20240318','Y','N','','','','','','2024-03-18 02:03:42','152','119.198.166.243','2024-03-18 02:03:45'),(123,'KR13','HD20240319','2024-03-19','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240319','20240319','!HD20240319','Y','N','','','','','','2024-03-19 11:58:08','152','119.198.166.243','2024-03-19 11:58:15'),(124,'KR13','HD20240320','2024-03-20','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',32,10000,'','','003','Y','d20240320','20240320','!HD20240320','Y','N','','','','','','2024-03-20 00:28:32','152','119.198.166.243','2024-03-20 00:28:38'),(125,'KR13','HD20240321','2024-03-21','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',28,10000,'','','003','Y','d20240321','20240321','!HD20240321','Y','N','','','','','','2024-03-21 11:33:41','152','119.198.166.243','2024-03-21 11:33:47'),(126,'KR13','HD20240322','2024-03-22','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',25,10000,'','','003','Y','d20240322','20240322','!HD20240322','Y','N','','','','','','2024-03-25 15:43:27','152','119.198.166.243','2024-03-25 15:43:57'),(127,'KR13','HD20240325','2024-03-25','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',25,10000,'','','003','Y','d20240325','20240325','!HD20240325','Y','N','','','','','','2024-03-25 15:43:53','152','119.198.166.243','2024-03-25 15:43:57'),(128,'KR13','HD20240326','2024-03-26','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',20,10000,'','','003','Y','d20240326','20240326','!HD20240326','Y','N','','','','','','2024-03-26 15:43:17','152','119.198.166.243','2024-03-26 15:43:22'),(129,'KR13','HD20240327','2024-03-27','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',23,10000,'','','003','Y','d20240327','20240327','!HD20240327','Y','N','','','','','','2024-03-27 19:38:59','152','119.198.166.243','2024-03-27 19:39:02'),(130,'KR13','HD20240328','2024-03-28','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',22,10000,'','','003','Y','d20240328','20240328','!HD20240328','Y','N','','','','','','2024-03-28 13:51:01','152','119.198.166.243','2024-03-28 13:51:05'),(131,'KR13','HD20240329','2024-03-29','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',23,10000,'','','003','Y','d20240329','20240329','!HD20240329','Y','N','','','','','','2024-03-29 10:04:51','152','119.198.166.243','2024-03-29 10:04:54'),(132,'KR13','HD20240401','2024-04-01','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',22,10000,'','','003','Y','d20240401','20240401','!HD20240401','Y','N','','','','','','2024-04-01 11:06:56','152','119.198.166.243','2024-04-01 11:07:00'),(133,'KR13','HD20240402','2024-04-02','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240402','20240402','!HD20240402','Y','N','','','','','','2024-04-02 19:07:36','152','119.198.166.243','2024-04-02 19:07:45'),(134,'KR13','HD20240403','2024-04-03','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',35,10000,'','','003','Y','d20240403','20240403','!HD20240403','Y','N','','','','','','2024-04-04 12:05:40','152','119.198.166.243','2024-04-04 12:06:12'),(135,'KR13','HD20240404','2024-04-04','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',38,10000,'','','003','Y','d20240404','20240404','!HD20240404','Y','N','','','','','','2024-04-04 12:06:06','152','119.198.166.243','2024-04-04 12:06:12'),(136,'KR13','HD20240405','2024-04-05','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240405','20240405','!HD20240405','Y','N','','','','','','2024-04-08 01:03:51','152','119.198.166.243','2024-04-08 01:03:55'),(137,'KR13','HD20240408','2024-04-08','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',37,10000,'','','003','Y','d20240408','20240408','!HD20240408','Y','N','','','','','','2024-04-08 01:06:30','152','119.198.166.243','2024-04-08 01:06:35'),(138,'KR13','HD20240409','2024-04-09','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',33,10000,'','','003','Y','d20240409','20240409','!HD20240409','Y','N','','','','','','2024-04-09 17:39:54','152','119.198.166.243','2024-04-09 17:39:58'),(139,'KR13','HD20240411','2024-04-11','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',33,10000,'','','003','Y','d20240411','20240411','!HD20240411','Y','N','','','','','','2024-04-12 10:55:20','152','119.198.166.243','2024-04-12 10:56:31'),(140,'KR13','HD20240412','2024-04-12','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',35,10000,'','','003','Y','d20240412','20240412','!HD20240412','Y','N','','','','','','2024-04-12 10:56:24','152','119.198.166.243','2024-04-12 10:56:31'),(141,'KR13','HD20240415','2024-04-15','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',33,10000,'','','003','Y','d20240415','20240415','!HD20240415','Y','N','','','','','','2024-04-16 13:33:37','152','119.198.166.243','2024-04-16 13:34:12'),(142,'KR13','HD20240416','2024-04-16','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',41,10000,'','','003','Y','d20240416','20240416','!HD20240416','Y','N','','','','','','2024-04-16 13:34:07','152','119.198.166.243','2024-04-16 13:34:12'),(143,'KR13','HD20240417','2024-04-17','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',33,10000,'','','003','Y','d20240417','20240417','!HD20240417','Y','N','','','','','','2024-04-18 02:00:18','152','119.198.166.243','2024-04-18 02:00:48'),(144,'KR13','HD20240418','2024-04-18','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',39,10000,'','','003','Y','d20240418','20240418','!HD20240418','Y','N','','','','','','2024-04-18 02:00:43','152','119.198.166.243','2024-04-18 02:00:48'),(145,'KR13','HD20240419','2024-04-19','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',39,10000,'','','003','Y','d20240419','20240419','!HD20240419','Y','N','','','','','','2024-04-22 01:02:51','152','119.198.166.243','2024-04-22 01:03:26'),(146,'KR13','HD20240422','2024-04-22','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',33,10000,'','','003','Y','d20240422','20240422','!HD20240422','Y','N','','','','','','2024-04-22 01:03:20','152','119.198.166.243','2024-04-22 01:03:26'),(147,'KR13','HD20240423','2024-04-23','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240423','20240423','!HD20240423','Y','N','','','','','','2024-04-23 11:27:55','152','119.198.166.243','2024-04-23 11:27:59'),(148,'KR13','HD20240424','2024-04-24','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240424','20240424','!HD20240424','Y','N','','','','','','2024-04-24 01:52:53','152','119.198.166.243','2024-04-24 01:52:57'),(149,'KR13','HD20240425','2024-04-25','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',31,10000,'','','003','Y','d20240425','20240425','!HD20240425','Y','N','','','','','','2024-04-25 00:24:48','152','119.198.166.243','2024-04-25 00:24:54'),(150,'KR13','HD20240426','2024-04-26','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',40,10000,'','','003','Y','d20240426','20240426','!HD20240426','Y','N','','','','','','2024-04-26 12:23:33','152','119.198.166.243','2024-04-26 12:23:37'),(151,'KR13','HD20240429','2024-04-29','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',30,10000,'','','003','Y','d20240429','20240429','!HD20240429','Y','N','','','','','','2024-04-30 00:49:15','152','119.198.166.243','2024-04-30 00:49:46'),(152,'KR13','HD20240430','2024-04-30','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',28,10000,'','','003','Y','d20240430','20240430','!HD20240430','Y','N','','','','','','2024-04-30 00:49:41','152','119.198.166.243','2024-04-30 00:49:46'),(153,'KR13','HD20240502','2024-05-02','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',33,10000,'','','003','Y','d20240502','20240502','!HD20240502','Y','N','','','','','','2024-05-02 19:12:17','152','119.198.166.243','2024-05-02 19:12:21'),(154,'KR13','HD20240503','2024-05-03','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',39,10000,'','','003','Y','d20240503','20240503','!HD20240503','Y','N','','','','','','2024-05-03 01:14:38','152','119.198.166.243','2024-05-03 01:14:43'),(155,'KR13','20240724R','2024-07-24','KR13S00024','HD540PRO3','{\"size\":\"250*100*300\",\"unit\":\"005\"}','KR13-WP-01',35,10000,'','','003','Y','','','','Y','N','','','','','','2024-07-24 09:27:47','152','211.54.148.249','2024-07-24 09:27:51'),(156,'KR13','20240725R','2024-07-25','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',32,40000000,'','','003','Y','','','','Y','N','','','','','','2024-07-25 11:50:01','152','211.54.148.249','2024-07-25 11:50:16'),(157,'KR13','20240730R','2024-07-30','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',31,40000000,'','','003','Y','','','','Y','N','','','','','','2024-07-30 10:01:02','152','211.54.148.249','2024-07-30 10:01:06'),(158,'KR13','20240731R','2024-07-31','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',33,40000000,'','','003','Y','','','','Y','N','','','','','','2024-07-31 11:21:46','152','211.54.148.249','2024-07-31 11:21:48'),(159,'KR13','20240801R','2024-08-01','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',30,40000000,'','','003','Y','','','','Y','N','','','','','','2024-08-01 13:34:34','152','211.54.148.249','2024-08-01 13:34:38'),(160,'KR13','20240805R','2024-08-05','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',31,40000000,'','','003','Y','','','','Y','N','','','','','','2024-08-05 10:22:29','152','211.54.148.249','2024-08-05 10:22:32'),(161,'KR13','20240806R','2024-08-06','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',35,40000000,'','','003','Y','','','','Y','N','','','','','','2024-08-06 09:12:58','152','211.54.148.249','2024-08-06 09:13:02'),(162,'KR13','20240808R','2024-08-08','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',35,40000000,'','','003','Y','','','','Y','N','','','','','','2024-08-08 10:04:49','152','211.54.148.249','2024-08-08 10:04:52'),(163,'KR13','20240813R','2024-08-13','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',32,40000000,'','','003','Y','','','','Y','N','','','','','','2024-08-13 09:11:20','152','211.54.148.249','2024-08-13 09:11:22'),(164,'KR13','20240819R','2024-08-19','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',30,40000000,'','','003','Y','','','','Y','N','','','','','','2024-08-19 13:21:06','152','211.54.148.249','2024-08-19 13:21:09'),(165,'KR13','20240821R','2024-08-21','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',33,40000000,'','','003','Y','','','','Y','N','','','','','','2024-08-21 09:36:02','152','211.54.148.249','2024-08-21 09:36:07'),(166,'KR13','20240823R','2024-08-23','KR13S00015','HD540PRO','{\"size\":\"2150*2080*930\",\"unit\":\"005\"}','KR13-WP-01',32,40000000,'','','003','Y','','','','Y','N','','','','','','2024-08-23 16:31:12','152','211.54.148.249','2024-08-23 16:31:15');
/*!40000 ALTER TABLE `job_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kakao_history`
--

DROP TABLE IF EXISTS `kakao_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kakao_history` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Index Key',
  `local_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '공장 코드 (factory.local_cd) 또는 센터코드(center.cen_uc)',
  `cust_cd` varchar(50) DEFAULT '' COMMENT '업체코드 (biz_list.cust_cd) 또는 앱 외주공장코드(center_biz_list.cust_cd)',
  `phone` varchar(50) DEFAULT '' COMMENT '수신자 전화번호',
  `call_back` varchar(50) DEFAULT '' COMMENT '발신자 전화번호',
  `template_cd` varchar(50) DEFAULT '' COMMENT '탬플릿 코드',
  `msg` mediumtext DEFAULT '' COMMENT '전송 메시지',
  `finyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '처리구분 (Y: 발송성공 / N: 발송실패)',
  `result_cd` varchar(10) NOT NULL DEFAULT '' COMMENT '카카오 알림API result_code 저장',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(50) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(50) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(50) NOT NULL DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(50) NOT NULL DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  KEY `FK_kakao_history_factory` (`local_cd`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='카카오톡 알림API 발송 히스토리';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kakao_history`
--

LOCK TABLES `kakao_history` WRITE;
/*!40000 ALTER TABLE `kakao_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `kakao_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `machine`
--

DROP TABLE IF EXISTS `machine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `machine` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `main_cd` varchar(50) NOT NULL DEFAULT 'MC' COMMENT '메인 코드',
  `mc_seq` varchar(50) NOT NULL DEFAULT '01' COMMENT '설비 코드순번',
  `mc_uc` varchar(50) NOT NULL COMMENT '설비 고유 코드(공장코드-메인코드-설비 코드순번 조합)',
  `mc_cd` varchar(50) NOT NULL DEFAULT 'MC10' COMMENT '설비 코드',
  `mc_gb` varchar(50) NOT NULL DEFAULT '' COMMENT '설비 유형',
  `mc_no` varchar(5) NOT NULL DEFAULT '' COMMENT '설비 정렬순서',
  `mc_nm` varchar(255) NOT NULL DEFAULT '' COMMENT '설비명',
  `maker` varchar(50) DEFAULT '' COMMENT '설비 메이커명/제조사',
  `model_nm` varchar(50) DEFAULT '' COMMENT '설비 모델명',
  `serial_no` varchar(50) DEFAULT '' COMMENT '설비 시리얼번호',
  `spec` varchar(50) DEFAULT '' COMMENT '설비 규격',
  `buy_corp` varchar(50) DEFAULT '' COMMENT '구매처',
  `buy_dt` date DEFAULT NULL COMMENT '구매일자',
  `amt` float DEFAULT 0 COMMENT '구매금액',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능) (사용안함)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_mc_seq` (`local_cd`,`main_cd`,`mc_seq`),
  UNIQUE KEY `mc_uc` (`mc_uc`),
  UNIQUE KEY `local_cd_mc_nm` (`local_cd`,`mc_nm`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='공장 별 설비 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machine`
--

LOCK TABLES `machine` WRITE;
/*!40000 ALTER TABLE `machine` DISABLE KEYS */;
/*!40000 ALTER TABLE `machine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `month_log`
--

DROP TABLE IF EXISTS `month_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `month_log` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `rec_gb` char(1) NOT NULL DEFAULT 'F' COMMENT '사용처 구분 (F: 공장 / C: 센터)',
  `uc_cd` varchar(20) NOT NULL COMMENT '공장 코드 or 센터 코드',
  `ul_gb` varchar(10) NOT NULL DEFAULT '' COMMENT '로그 구분 (DA/050)',
  `crud` enum('L','O','C','R','U','D') NOT NULL DEFAULT 'L' COMMENT '활동 구분(L: 로그인, O: 로그 아웃, C: 등록, R: 조회, U: 수정, D: 삭제)',
  `acc_gb` enum('P','A') NOT NULL DEFAULT 'P' COMMENT '접속 유형(P: PC, A: APP)',
  `base_dt` varchar(7) DEFAULT NULL COMMENT '통계 기준년월 (YYYY-MM)',
  `count` int(11) NOT NULL DEFAULT 0 COMMENT '통계 카운터',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고3',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장/센터 사용자 월별 통계 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `month_log`
--

LOCK TABLES `month_log` WRITE;
/*!40000 ALTER TABLE `month_log` DISABLE KEYS */;
INSERT INTO `month_log` VALUES (37,'F','KR13','001','L','P','2022-10',14,'','N','Y','N','','','','152','1.215.144.226','2022-10-18 14:23:13','','','2022-10-27 10:12:26'),(38,'F','KR13','001','L','P','2022-11',24,'','N','Y','N','','','','152','1.215.144.226','2022-11-03 17:31:17','','','2022-11-30 17:12:26'),(39,'F','KR14','001','L','P','2022-11',2,'','N','Y','N','','','','153','1.215.144.226','2022-11-14 14:23:29','','','2022-11-29 17:57:26'),(40,'F','KR13','001','L','P','2022-12',5,'','N','Y','N','','','','152','1.215.144.226','2022-12-01 15:43:48','','','2022-12-08 13:06:09'),(41,'F','KR13','001','L','P','2023-03',1,'','N','Y','N','','','','152','106.101.2.129','2023-03-08 14:46:33','','','2023-03-08 14:46:33'),(42,'F','KR13','001','L','P','2023-04',1,'','N','Y','N','','','','152','211.197.126.48','2023-04-28 12:42:33','','','2023-04-28 12:42:33'),(43,'F','KR13','001','L','P','2023-05',1,'','N','Y','N','','','','152','112.145.146.15','2023-05-19 13:26:26','','','2023-05-19 13:26:26'),(44,'F','KR13','001','L','P','2023-12',30,'','N','Y','N','','','','152','112.145.146.45','2023-12-08 18:56:14','','','2023-12-28 10:44:52'),(45,'F','KR13','001','L','P','2024-01',6,'','N','Y','N','','','','152','211.54.148.249','2024-01-02 16:30:18','','','2024-01-17 15:39:21'),(46,'F','KR13','001','L','P','2024-02',1,'','N','Y','N','','','','152','119.198.166.243','2024-02-26 13:05:57','','','2024-02-26 13:05:57'),(47,'F','KR13','001','L','P','2024-03',15,'','N','Y','N','','','','152','119.198.166.243','2024-03-04 17:05:33','','','2024-03-29 10:04:21'),(48,'F','KR13','001','L','P','2024-04',15,'','N','Y','N','','','','152','119.198.166.243','2024-04-01 11:06:13','','','2024-04-30 00:48:46'),(49,'F','KR13','001','L','P','2024-05',1,'','N','Y','N','','','','152','119.198.166.243','2024-05-02 19:11:36','','','2024-05-02 19:11:36'),(50,'F','KR13','001','L','P','2024-06',1,'','N','Y','N','','','','152','211.54.148.249','2024-06-26 15:11:09','','','2024-06-26 15:11:09'),(51,'F','KR13','001','L','P','2024-07',6,'','N','Y','N','','','','152','106.101.131.70','2024-07-02 14:03:13','','','2024-07-31 11:21:22'),(52,'F','KR13','001','L','P','2024-08',11,'','N','Y','N','','','','152','211.54.148.249','2024-08-01 13:34:17','','','2024-08-27 21:26:15');
/*!40000 ALTER TABLE `month_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `not_used`
--

DROP TABLE IF EXISTS `not_used`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `not_used` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `main_cd` varchar(20) NOT NULL DEFAULT 'NU' COMMENT '메인 코드',
  `nu_seq` varchar(20) NOT NULL DEFAULT '01' COMMENT '비가동 코드순번',
  `nu_uc` varchar(20) NOT NULL COMMENT '비가동 고유 코드(공장코드-메인코드-비가동 코드순번 조합)',
  `nu_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '비가동 명',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능) (사용안함)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_nu_seq` (`local_cd`,`main_cd`,`nu_seq`) USING BTREE,
  UNIQUE KEY `nu_uc` (`nu_uc`) USING BTREE,
  UNIQUE KEY `local_cd_nu_nm` (`local_cd`,`nu_nm`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장별 비가동 유형 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `not_used`
--

LOCK TABLES `not_used` WRITE;
/*!40000 ALTER TABLE `not_used` DISABLE KEYS */;
INSERT INTO `not_used` VALUES (30,'KR13','NU','01','KR13-NU-01','점심시간','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:26:20','','',NULL),(31,'KR13','NU','02','KR13-NU-02','휴식','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:26:23','','',NULL),(32,'KR13','NU','03','KR13-NU-03','교육','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:26:27','','',NULL);
/*!40000 ALTER TABLE `not_used` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notice` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `category` enum('N','S') NOT NULL DEFAULT 'N' COMMENT '카테고리 (N: 일반 / S: 중요)',
  `title` varchar(255) DEFAULT '' COMMENT '제목',
  `content` mediumtext DEFAULT '' COMMENT '내용',
  `cnt` int(11) DEFAULT 0 COMMENT '조회수',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고3',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일자',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일자',
  PRIMARY KEY (`ikey`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='플랫폼 별 전체 공지사항 관리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
INSERT INTO `notice` VALUES (38,'KR13','N','123','<p>111</p>\n',1,'','N','Y','N','','','','152','211.54.148.249','2023-12-20 14:42:13','','',NULL);
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ord_acc_list`
--

DROP TABLE IF EXISTS `ord_acc_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ord_acc_list` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ikey',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_allips.factory)',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 코드 (biz_list.cust_cd)',
  `acc_no` varchar(20) NOT NULL COMMENT '전표 번호 (acc_dt+hhiiss)',
  `ord_no` varchar(20) DEFAULT '' COMMENT '주문 번호 (ord_master.ord_no)',
  `work` enum('IN','OUT') DEFAULT 'IN' COMMENT '거래 구분 (IN: 매출 증감, OUT: 매출 차감)',
  `detail` varchar(5) DEFAULT '001' COMMENT '거래 상세 (AC/120)',
  `acc_dt` date DEFAULT NULL COMMENT '거래 일자 - 매출:주문일, 수금:수금일 (yyyy-MM-dd)',
  `acc_type` char(5) DEFAULT '' COMMENT '결제 방식 (AC/020)',
  `bl_cd` varchar(5) DEFAULT '' COMMENT '은행 코드 (AC/030 - 결제구분을 통장으로 선택시)',
  `acc_nm` varchar(255) DEFAULT '' COMMENT '입금자',
  `bl_num` varchar(255) DEFAULT '' COMMENT '계좌 번호',
  `amt` float DEFAULT 0 COMMENT '금액',
  `tax` float DEFAULT 0 COMMENT '세액',
  `vat` enum('Y','N','S') DEFAULT 'N' COMMENT '부가세 여부 (N: 과세, Y: 면세, S: 영세)',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` date DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_cust_cd_acc_no` (`local_cd`,`cust_cd`,`acc_no`),
  KEY `FK_acc_list_copy_biz_list` (`cust_cd`),
  CONSTRAINT `FK_acc_list_copy_biz_list` FOREIGN KEY (`cust_cd`) REFERENCES `biz_list` (`cust_cd`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='주문 회계 장부 (매출/수금 관리)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ord_acc_list`
--

LOCK TABLES `ord_acc_list` WRITE;
/*!40000 ALTER TABLE `ord_acc_list` DISABLE KEYS */;
INSERT INTO `ord_acc_list` VALUES (67,'KR13','KR13C00001','20221104011543','2022110443762','IN','001','2022-11-04','','','','',40000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:15:43','152','1.215.144.226','2022-11-04'),(68,'KR13','KR13C00002','20221104012548','2022110474541','IN','001','2022-11-04','','','','',40000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:25:48','','',NULL),(69,'KR13','KR13C00003','20221104012602','2022110415487','IN','001','2022-11-04','','','','',40000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:26:02','','',NULL),(70,'KR13','KR13C00004','20221104012612','2022110467214','IN','001','2022-11-04','','','','',40000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:26:12','','',NULL),(71,'KR13','KR13C00005','20221104012626','2022110462968','IN','001','2022-11-04','','','','',40000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:26:26','','',NULL),(72,'KR13','KR13C00006','20221104012656','2022110481923','IN','001','2022-11-04','','','','',40000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:26:56','','',NULL),(73,'KR13','KR13C00007','20221104012726','2022110487831','IN','001','2022-11-04','','','','',120000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:27:26','','',NULL),(74,'KR13','KR13C00009','20221104012740','2022110433654','IN','001','2022-11-04','','','','',40000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:27:40','','',NULL),(75,'KR13','KR13C00010','20221104012802','2022110441347','IN','001','2022-11-04','','','','',120000000,0,'Y','','N','Y','N','152','1.215.144.226','2022-11-04 13:28:02','','',NULL),(76,'KR13','KR13C00008','20221111092900','2022111133779','IN','001','2022-11-11','','','','',40000000,4000000,'N','','N','Y','N','152','1.215.144.226','2022-11-11 09:29:00','','',NULL),(77,'KR13','KR13C00009','20221116015017','2022111666442','IN','001','2022-11-16','','','','',8500,850,'N','','N','Y','N','152','121.156.13.66','2022-11-16 13:50:17','152','121.156.13.66','2022-12-01');
/*!40000 ALTER TABLE `ord_acc_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ord_detail`
--

DROP TABLE IF EXISTS `ord_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ord_detail` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 고유 코드 (biz_list.cust_cd)',
  `ord_no` varchar(20) NOT NULL DEFAULT '' COMMENT '주문 번호 (등록일자+난수 5자리 조합)',
  `ord_seq` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '순번',
  `ord_bseq` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '상세 순번-번들 (분할순번)',
  `lot` varchar(20) DEFAULT '' COMMENT '주문 로트 (주문번호+4자리 순번 조합)',
  `mall_nm` varchar(100) DEFAULT '' COMMENT '온라인 쇼핑몰명',
  `client_nm` varchar(100) DEFAULT '' COMMENT '고객명',
  `client_tel` varchar(100) DEFAULT '' COMMENT '연락처',
  `dlv_gb` varchar(5) DEFAULT '' COMMENT '배송 구분 (DI/010)',
  `dlv_zip` varchar(255) DEFAULT '' COMMENT '우편번호',
  `address` varchar(255) DEFAULT '' COMMENT '배송 주소',
  `addr_detail` varchar(255) DEFAULT '' COMMENT '배송 상세주소',
  `addr_text` varchar(255) DEFAULT '' COMMENT '배송 요청사항',
  `item_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '품목 코드 (item_list.item_cd)',
  `item_nm` varchar(255) NOT NULL DEFAULT '' COMMENT '품목 명 (item_list.item_nm)',
  `item_gb` longtext NOT NULL DEFAULT '' COMMENT '추가 분류 [JSON]',
  `ord_spec` longtext NOT NULL DEFAULT '' COMMENT '주문 상세 스펙 (규격/단위/분할) [JSON]',
  `ord_qty` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '수량',
  `sale_amt` float NOT NULL DEFAULT 0 COMMENT '판매 단가',
  `ord_amt` float NOT NULL DEFAULT 0 COMMENT '주문 금액',
  `tax_amt` float NOT NULL DEFAULT 0 COMMENT '세액 금액',
  `amt_unit` varchar(5) NOT NULL DEFAULT '001' COMMENT '금액 화폐단위 (공통 - 기본은 원)',
  `memo` longtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `ord_no_ord_seq_ord_bseq` (`ord_no`,`ord_seq`,`ord_bseq`) USING BTREE,
  UNIQUE KEY `lot` (`lot`) USING BTREE,
  CONSTRAINT `FK_ord_detail_ord_master` FOREIGN KEY (`ord_no`) REFERENCES `ord_master` (`ord_no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1928 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='[식품 제품군] 온라인 주문 상세 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ord_detail`
--

LOCK TABLES `ord_detail` WRITE;
/*!40000 ALTER TABLE `ord_detail` DISABLE KEYS */;
INSERT INTO `ord_detail` VALUES (1909,'KR13','KR13C00001','2022110443762',1,1,'20221104437620001','','','','001','','','','','KR13S00001','ESS RACK SYSTEM 개발','','{\"size\":\"1\",\"unit\":\"005\"}',1,35000000,35000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:25:02','','',NULL),(1910,'KR13','KR13C00002','2022110474541',1,1,'20221104745410001','','','','001','','','','','KR13S00013','비콘 하드웨어 개발','','{\"size\":\"1\",\"unit\":\"005\"}',1,38500000,38500000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:25:48','','',NULL),(1911,'KR13','KR13C00003','2022110415487',1,1,'20221104154870001','','','','001','','','','','KR13S00002','버스형 신발먼지제거기 개발','','{\"size\":\"1\",\"unit\":\"005\"}',1,35000000,35000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:26:02','','',NULL),(1912,'KR13','KR13C00004','2022110467214',1,1,'20221104672140001','','','','001','','','','','KR13S00003','가정용 신발먼지제거기 개발','','{\"size\":\"1\",\"unit\":\"005\"}',1,35000000,35000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:26:12','','',NULL),(1913,'KR13','KR13C00005','2022110462968',1,1,'20221104629680001','','','','001','','','','','KR13S00004','시각장애인용 물감통 개발','','{\"size\":\"1\",\"unit\":\"005\"}',1,29000000,29000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:26:26','','',NULL),(1914,'KR13','KR13C00006','2022110481923',1,1,'20221104819230001','','','','001','','','','','KR13S00005','16mm 커넥터 개발','','{\"size\":\"1\",\"unit\":\"005\"}',1,40000000,40000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:26:56','','',NULL),(1915,'KR13','KR13C00007','2022110487831',1,1,'20221104878310001','','','','001','','','','','KR13S00006','FLCC 하우징 제작','','{\"size\":\"1\",\"unit\":\"005\"}',1,40000000,40000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:27:26','','',NULL),(1916,'KR13','KR13C00007','2022110487831',2,1,'20221104878310002','쇼핑몰명 입력','','','001','','','','','KR13S00007','Safety Guard 개발 및 제작','','{\"size\":\"1\",\"unit\":\"005\"}',1,40000000,40000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:27:26','','',NULL),(1917,'KR13','KR13C00007','2022110487831',3,1,'20221104878310003','쇼핑몰명 입력','','','001','','','','','KR13S00008','Checkered Plate 개발 및 제작','','{\"size\":\"1\",\"unit\":\"005\"}',1,29000000,29000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:27:26','','',NULL),(1918,'KR13','KR13C00009','2022110433654',1,1,'20221104336540001','','','','001','','','','','KR13S00009','낚시용 미끼 시제품 제작','','{\"size\":\"1\",\"unit\":\"005\"}',1,35000000,35000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:27:40','','',NULL),(1919,'KR13','KR13C00010','2022110441347',1,1,'20221104413470001','','','','001','','','','','KR13S00010','DY파워 마그네트 개발 및 제작','','{\"size\":\"1\",\"unit\":\"005\"}',1,40000000,40000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:28:02','','',NULL),(1920,'KR13','KR13C00010','2022110441347',2,1,'20221104413470002','쇼핑몰명 입력','','','001','','','','','KR13S00011','영화금속 마그네트 개발 및 제작','','{\"size\":\"1\",\"unit\":\"005\"}',1,38500000,38500000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:28:02','','',NULL),(1921,'KR13','KR13C00010','2022110441347',3,1,'20221104413470003','쇼핑몰명 입력','','','001','','','','','KR13S00012','자전거 잠금장치용 마그네트 개발 및 제작','','{\"size\":\"1\",\"unit\":\"005\"}',1,40000000,40000000,0,'001','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:28:02','','',NULL),(1927,'KR13','KR13C00009','2022111666442',1,1,'20221116664420001','','D50FFB2EE242819E5731688F323A96A3','0D4564C3DA2105D59993D72BC9FAFE3A','001','','D1A456C686E680C16538A648EB90CCC308E770E040E29EC805250D04FE8C58266362928206B0F1200ECCCEB15CDBB886','90D20CD2593EDECE5023FE5CA45A020E15C2A1AF42EF0D9D8AAEC4DD28B91725','','KR13S00014','smile egi 11.16','','{\"size\":\"1\",\"unit\":\"005\"}',1,8500,8500,850,'001','','N','Y','N','','','','152','121.156.13.66','2022-12-01 18:46:27','','',NULL);
/*!40000 ALTER TABLE `ord_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ord_master`
--

DROP TABLE IF EXISTS `ord_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ord_master` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `cust_cd` varchar(20) NOT NULL COMMENT '거래처 고유 코드 (biz_list.cust_cd)',
  `cust_nm` varchar(20) NOT NULL DEFAULT '' COMMENT '거래처(별칭) 명 (biz_list.cust_nm)',
  `biz_nm` varchar(20) NOT NULL DEFAULT '' COMMENT '사업장(고객) 명 (biz_list.biz_nm)',
  `ord_no` varchar(20) NOT NULL DEFAULT '' COMMENT '주문 번호 (등록일자+난수 5자리 조합)',
  `ord_dt` date DEFAULT NULL COMMENT '주문 일자 (yyyy-MM-dd)',
  `vat` enum('Y','N','S') NOT NULL DEFAULT 'N' COMMENT '부가세 여부 (N: 과세, Y: 면세, S: 영세)',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `state` varchar(5) NOT NULL DEFAULT '001' COMMENT '진행 상태 (PR/090)',
  `finyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '전표 마감 여부 (N: 대기, Y: 마감)',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `ord_no` (`ord_no`) USING BTREE,
  KEY `ord_dt` (`ord_dt`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='[식품 제품군] 온라인 주문 마스터 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ord_master`
--

LOCK TABLES `ord_master` WRITE;
/*!40000 ALTER TABLE `ord_master` DISABLE KEYS */;
INSERT INTO `ord_master` VALUES (65,'KR13','KR13C00001','현대 일렉트릭','현대 일렉트릭','2022110443762','2022-09-16','Y','','002','N','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:15:43','152','1.215.144.226','2022-11-04 13:25:02'),(66,'KR13','KR13C00002','C2O','C2O','2022110474541','2022-07-27','Y','','002','N','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:25:48','','',NULL),(67,'KR13','KR13C00003','원프라스틱(주)','원프라스틱(주)','2022110415487','2022-08-15','Y','','002','N','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:26:02','152','1.215.144.226','2022-11-04 13:26:31'),(68,'KR13','KR13C00004','(주)미래에스비','(주)미래에스비','2022110467214','2022-08-16','Y','','002','N','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:26:12','152','1.215.144.226','2022-11-04 13:26:31'),(69,'KR13','KR13C00005','(주)어나더데이','(주)어나더데이','2022110462968','2022-09-01','Y','','002','N','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:26:26','152','1.215.144.226','2022-11-04 13:26:31'),(70,'KR13','KR13C00006','(주)커넥터','(주)커넥터','2022110481923','2022-10-03','Y','','002','N','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:26:56','152','1.215.144.226','2022-11-04 13:28:05'),(71,'KR13','KR13C00007','(주)TJ에어로시스템즈','(주)TJ에어로시스템즈','2022110487831','2022-10-03','Y','','002','N','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:27:26','152','1.215.144.226','2022-11-04 13:28:05'),(72,'KR13','KR13C00009','(주)다솔낚시마트','(주)다솔낚시마트','2022110433654','2022-09-11','Y','','002','N','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:27:40','152','1.215.144.226','2022-11-04 13:28:05'),(73,'KR13','KR13C00010','(주)상영마그네트','(주)상영마그네트','2022110441347','2022-09-12','Y','','002','N','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:28:02','152','1.215.144.226','2022-11-04 13:28:05'),(75,'KR13','KR13C00009','(주)다솔낚시마트','(주)다솔낚시마트','2022111666442','2022-11-17','N','','001','N','N','Y','N','','','','152','121.156.13.66','2022-11-16 13:50:17','152','121.156.13.66','2022-12-01 18:46:26');
/*!40000 ALTER TABLE `ord_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proc_detail`
--

DROP TABLE IF EXISTS `proc_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proc_detail` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (factory.local_cd)',
  `pc_uc` varchar(20) NOT NULL COMMENT '라우팅 코드',
  `pp_uc` varchar(20) NOT NULL COMMENT '공정 코드 (prod_proc.pp_uc)',
  `pr_seq` varchar(20) NOT NULL DEFAULT '1' COMMENT '작업 순서 (공정 절차)',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / 사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  KEY `FK_proc_detail_proc_master` (`pc_uc`),
  KEY `FK_proc_detail_prod_proc` (`pp_uc`),
  CONSTRAINT `FK_proc_detail_proc_master` FOREIGN KEY (`pc_uc`) REFERENCES `proc_master` (`pc_uc`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=212 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='라우팅 관리 상세 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proc_detail`
--

LOCK TABLES `proc_detail` WRITE;
/*!40000 ALTER TABLE `proc_detail` DISABLE KEYS */;
INSERT INTO `proc_detail` VALUES (209,'KR13','KR13-PC-01','KR13-PP-01','1','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:33:56','','',NULL),(210,'KR13','KR13-PC-02','KR13-PP-02','1','','N','Y','N','','','','152','211.54.148.249','2023-12-14 14:18:00','','',NULL),(211,'KR13','KR13-PC-03','KR13-PP-03','1','12/22','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:16:02','','',NULL);
/*!40000 ALTER TABLE `proc_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proc_master`
--

DROP TABLE IF EXISTS `proc_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proc_master` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (factory.local_cd)',
  `main_cd` varchar(20) NOT NULL DEFAULT 'PC' COMMENT '메인 코드',
  `pc_seq` varchar(20) NOT NULL DEFAULT '01' COMMENT '라우팅 코드순번',
  `pc_uc` varchar(20) NOT NULL COMMENT '라우팅 고유 코드 (공장코드-메인코드-라우터 코드순번 조합)',
  `pc_cd` varchar(20) NOT NULL DEFAULT 'PC10' COMMENT '라우팅 코드',
  `pc_nm` varchar(255) NOT NULL DEFAULT '' COMMENT '라우팅 명',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / 사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_pc_seq` (`local_cd`,`main_cd`,`pc_seq`) USING BTREE,
  UNIQUE KEY `pc_uc` (`pc_uc`) USING BTREE,
  UNIQUE KEY `local_cd_pc_nm` (`local_cd`,`pc_nm`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='라우팅 관리 마스터 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proc_master`
--

LOCK TABLES `proc_master` WRITE;
/*!40000 ALTER TABLE `proc_master` DISABLE KEYS */;
INSERT INTO `proc_master` VALUES (88,'KR13','PC','01','KR13-PC-01','PC10','제작 라우팅','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:33:56','','',NULL),(89,'KR13','PC','02','KR13-PC-02','PC20','드론 제조','','N','Y','N','','','','152','211.54.148.249','2023-12-14 14:18:00','','',NULL),(90,'KR13','PC','03','KR13-PC-03','PC30','1222 라우팅','','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:16:02','','',NULL);
/*!40000 ALTER TABLE `proc_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_proc`
--

DROP TABLE IF EXISTS `prod_proc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prod_proc` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (factory.local_cd)',
  `main_cd` varchar(20) NOT NULL DEFAULT 'PP' COMMENT '메인 코드',
  `pp_seq` varchar(20) NOT NULL DEFAULT '01' COMMENT '공정 코드순번',
  `pp_uc` varchar(20) NOT NULL COMMENT '공정 고유 코드 (공장코드-메인코드-공정 코드순번 조합)',
  `pp_cd` varchar(20) NOT NULL DEFAULT 'PP10' COMMENT '공정 코드',
  `pp_gb` varchar(20) NOT NULL DEFAULT '' COMMENT '공정 유형(PR/040)',
  `pp_no` varchar(5) NOT NULL DEFAULT '' COMMENT '공정 정렬순서',
  `pp_nm` varchar(255) NOT NULL DEFAULT '' COMMENT '공정명',
  `prod_gb` enum('A','B') NOT NULL DEFAULT 'A' COMMENT '공정 구분 (A: 내부공정, B: 외주공정)',
  `cust_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '외주 공정일 경우, 외주 거래처 코드 (biz_list.cust_cd)',
  `pp_qa` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '품질검사 사용여부 (Y: 사용 / N: 미사용)',
  `pp_hisyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '실적등록 사용여부 (Y: 사용 / N: 미사용)',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / 사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_pp_seq` (`local_cd`,`main_cd`,`pp_seq`),
  UNIQUE KEY `pp_uc` (`pp_uc`),
  UNIQUE KEY `local_cd_pp_gb_pp_nm` (`local_cd`,`pp_gb`,`pp_nm`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='공장별 공정(production process) 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_proc`
--

LOCK TABLES `prod_proc` WRITE;
/*!40000 ALTER TABLE `prod_proc` DISABLE KEYS */;
INSERT INTO `prod_proc` VALUES (101,'KR13','PP','01','KR13-PP-01','PP10','001','1','3D 프린팅','A','','Y','Y','','Y','Y','N','','','','152','1.215.144.226','2022-11-11 09:33:45','152','121.156.13.66','2022-11-15 15:53:53'),(102,'KR13','PP','02','KR13-PP-02','PP20','001','2','드론 제조','A','','Y','Y','','Y','Y','N','','','','152','211.54.148.249','2023-12-14 14:17:49','152','211.54.148.249','2023-12-14 14:18:00'),(103,'KR13','PP','03','KR13-PP-03','PP30','001','3','드론 제조 12/22','A','','Y','Y','','Y','Y','N','','','','152','211.54.148.249','2023-12-22 13:15:39','152','211.54.148.249','2023-12-22 13:16:02');
/*!40000 ALTER TABLE `prod_proc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `return_type`
--

DROP TABLE IF EXISTS `return_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `return_type` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `main_cd` varchar(50) NOT NULL DEFAULT 'RE' COMMENT '메인 코드',
  `re_seq` varchar(50) NOT NULL DEFAULT '01' COMMENT '반품 코드순번',
  `re_uc` varchar(50) NOT NULL COMMENT '반품 고유 코드(공장코드-메인코드-반품 코드순번 조합)',
  `re_gb` enum('IN','OUT') NOT NULL DEFAULT 'IN' COMMENT '반품 구분 (IN: 반품 입고, OUT: 반품 출고)',
  `re_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '반품 명',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능) (사용안함)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_re_seq` (`local_cd`,`main_cd`,`re_seq`) USING BTREE,
  UNIQUE KEY `re_uc` (`re_uc`) USING BTREE,
  UNIQUE KEY `local_cd_re_gb_re_nm` (`local_cd`,`re_gb`,`re_nm`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장별 반품 유형 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `return_type`
--

LOCK TABLES `return_type` WRITE;
/*!40000 ALTER TABLE `return_type` DISABLE KEYS */;
INSERT INTO `return_type` VALUES (12,'KR13','RE','01','KR13-RE-01','OUT','불량','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:32:44','','',NULL),(13,'KR13','RE','02','KR13-RE-02','OUT','파손','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:32:49','','',NULL);
/*!40000 ALTER TABLE `return_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ikey',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `st_sq` varchar(20) NOT NULL COMMENT '재고 번호 (등록일자+hhiiss)',
  `wh_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '창고 코드 (z_plan.warehouse.wh_uc)',
  `item_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '품목 코드 (item_list.item_cd)',
  `max_dt` date DEFAULT NULL COMMENT '유통 기한 (yyyy-MM-dd)',
  `stock_amt` float DEFAULT 0 COMMENT '재고 단가(입고)',
  `tax_amt` float DEFAULT 0 COMMENT '세액',
  `vat` enum('N','Y','S') DEFAULT 'Y' COMMENT '부가세 여부 (N: 과세, Y: 면세, S: 영세)',
  `base_qty` float DEFAULT 0 COMMENT '기초 재고',
  `in_qty` float unsigned NOT NULL DEFAULT 0 COMMENT '입고 수량(구매 입고)',
  `out_qty` float unsigned NOT NULL DEFAULT 0 COMMENT '출고 수량',
  `pr_in_qty` float unsigned NOT NULL DEFAULT 0 COMMENT '생산 입고',
  `pr_out_qty` float unsigned NOT NULL DEFAULT 0 COMMENT '생산 출고(자재 출고)',
  `re_in_qty` float unsigned NOT NULL DEFAULT 0 COMMENT '반품 입고',
  `re_out_qty` float NOT NULL DEFAULT 0 COMMENT '반품 출고',
  `flaw_qty` float NOT NULL DEFAULT 0 COMMENT '불량 수량',
  `qty` float NOT NULL DEFAULT 0 COMMENT '현재고',
  `book_qty` float unsigned NOT NULL DEFAULT 0 COMMENT '실사 재고 (장부 재고)',
  `barcode` varchar(20) NOT NULL COMMENT '바코드 번호 (등록일자+난수5자리 조합)',
  `spec` longtext NOT NULL DEFAULT '' COMMENT '재고 상세 [JSON]',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `st_sq` (`st_sq`),
  UNIQUE KEY `barcode` (`barcode`),
  UNIQUE KEY `wh_uc_item_cd_max_dt_stock_amt_vat` (`wh_uc`,`item_cd`,`max_dt`,`stock_amt`,`vat`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='창고 재고 관리 테이블 - 리뉴얼 완료';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (89,'KR13','221104013208','KR13-WH-01','KR13S00001','2022-08-27',500000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110459664','','','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:32:08','152','1.215.144.226','2022-11-04 13:40:57'),(90,'KR13','221104013717','KR13-WH-01','KR13S00013','2022-09-01',38500000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110482653','','','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:37:17','152','121.156.13.66','2022-12-01 18:50:26'),(91,'KR13','221104013756','KR13-WH-01','KR13S00002','2022-10-08',35000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110428608','','','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:37:56','152','1.215.144.226','2022-11-04 13:45:05'),(92,'KR13','221104013824','KR13-WH-01','KR13S00003','2022-10-09',35000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110481818','','','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:38:24','152','1.215.144.226','2022-11-04 13:45:21'),(93,'KR13','221104013858','KR13-WH-01','KR13S00004','2022-10-25',29000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110462240','','','Y','N','N','','','','152','1.215.144.226','2022-11-04 13:38:58','152','1.215.144.226','2022-11-04 13:45:35'),(95,'KR13','221104013950','KR13-WH-01','KR13S00006','2022-10-30',42000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110451260','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:39:50','152','1.215.144.226','2022-11-04 13:46:04'),(96,'KR13','221104014008','KR13-WH-01','KR13S00007','2022-10-30',43000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110460824','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:40:08','152','1.215.144.226','2022-11-04 13:46:15'),(97,'KR13','221104014021','KR13-WH-01','KR13S00008','2022-10-30',29000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110412390','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:40:21','152','1.215.144.226','2022-11-04 13:46:25'),(98,'KR13','221104014310','KR13-WH-01','KR13S00010','2022-11-05',400000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110448645','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:43:10','152','1.215.144.226','2022-11-04 13:46:42'),(99,'KR13','221104014325','KR13-WH-01','KR13S00011','2022-11-05',38500000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110413429','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:43:25','152','1.215.144.226','2022-11-04 13:47:37'),(100,'KR13','221104014335','KR13-WH-01','KR13S00012','2022-11-05',400000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022110462279','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:43:35','152','1.215.144.226','2022-11-04 13:47:45'),(101,'KR13','221202012920','KR13-WH-01','KR13S00009',NULL,35000000,0,'Y',1,0,1,0,0,0,0,0,0,0,'2022120296798','','','Y','Y','N','','','','152','1.215.144.226','2022-12-02 13:29:20','152','121.156.13.66','2022-12-02 13:44:25'),(102,'KR13','231215060151','KR13-WH-01','KR13S00018',NULL,10000,1000,'N',0,1,0,0,0,0,0,0,1,0,'2023121527332','','','N','Y','N','','','','152','211.54.148.249','2023-12-15 18:01:51','','',NULL),(103,'KR13','231219053340','KR13-WH-01','KR13B00015',NULL,10000,1000,'N',0,2,0,0,0,0,0,0,2,0,'2023121937120','','','Y','Y','N','','','','152','211.54.148.249','2023-12-19 17:33:40','152','211.54.148.249','2023-12-20 14:36:30'),(104,'KR13','231222011448','KR13-WH-01','KR13B00015',NULL,10000,0,'Y',10,0,0,0,0,0,0,0,10,0,'2023122296394','','','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:14:48','','',NULL),(105,'KR13','231222011742','KR13-WH-01','KR13B00016',NULL,10000,1000,'N',0,3,0,0,0,0,0,0,3,0,'2023122265032','','','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:17:42','','',NULL);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_history`
--

DROP TABLE IF EXISTS `stock_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_history` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ikey',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `job_sq` varchar(20) NOT NULL COMMENT '작업 번호 (put_dt+hhiiss)',
  `key_parent` varchar(20) NOT NULL COMMENT '부모키 (부모 ikey)',
  `put_dt` date DEFAULT NULL COMMENT '입/출고 일자 (yyyy-MM-dd)',
  `st_sq` varchar(20) DEFAULT '' COMMENT '재고 번호 (stock.st_sq)',
  `work` varchar(5) DEFAULT 'IN' COMMENT '작업 구분 (IN: 입고, OUT: 출고)',
  `details` varchar(5) NOT NULL DEFAULT '001' COMMENT '작업 상세 (WK/030)',
  `ord_no` varchar(20) NOT NULL DEFAULT '' COMMENT '오더 번호 (구매 발주 번호, 주문 번호, 제조 오더 번호)',
  `lot` varchar(20) NOT NULL DEFAULT '' COMMENT '로트 번호',
  `item_cd` varchar(20) NOT NULL DEFAULT '' COMMENT '품목 코드 (item_list.item_cd)',
  `qty` float unsigned NOT NULL DEFAULT 0 COMMENT '수량',
  `amt` float unsigned NOT NULL DEFAULT 0 COMMENT '단가',
  `tax` float unsigned NOT NULL DEFAULT 0 COMMENT '세액',
  `vat` enum('N','Y','S') NOT NULL DEFAULT 'N' COMMENT '부가세 여부 (N: 과세, Y: 면세, S: 영세)',
  `spec` longtext NOT NULL DEFAULT '' COMMENT '상세 [JSON]',
  `ul_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '배송담당자 고유 코드 (z_plan.user_list)',
  `state` varchar(5) NOT NULL DEFAULT '001' COMMENT '진행 상태 (PR/090)',
  `fin_dt` datetime DEFAULT NULL COMMENT '완료 일시',
  `barcode` varchar(20) DEFAULT '' COMMENT '바코드 번호 (stock.barcode)',
  `print_yn` enum('Y','N') DEFAULT 'N' COMMENT '바코드 출력여부 (N : 미출력 / Y : 출력완료)',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `jobno` (`job_sq`) USING BTREE,
  KEY `details` (`details`) USING BTREE,
  KEY `put_dt` (`put_dt`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=419 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='창고 입/출고 이력 관리 테이블 (리뉴얼 완료)\r\n=====================================================================================\r\n※ spec(PC-일반): size(규격), unit(단위), 반품일 경우(2항목 추가) -> re_gb(반품 유형), re_memo(반품 사유)\r\n※ spec(태블릿): size(규격), unit(단위), grade(시험성적서 체크), car(육안검사 차량 체크), state(육안검사 성상 체크), err(육안검사 이물혼입 체크)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_history`
--

LOCK TABLES `stock_history` WRITE;
/*!40000 ALTER TABLE `stock_history` DISABLE KEYS */;
INSERT INTO `stock_history` VALUES (387,'KR13','20221104013208','','2022-07-04','221104013208','IN','007','','','KR13S00001',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110459664','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:32:08','152','1.215.144.226','2022-11-04 13:40:57'),(388,'KR13','20221104013231','','2022-11-04','221104013208','OUT','002','2022110443762','20221104437620001','KR13S00001',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-11-04 13:12:15','2022110459664','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:32:31','152','1.215.144.226','2022-11-04 13:48:07'),(389,'KR13','20221104013717','','2022-07-09','221104013717','IN','007','','','KR13S00013',1,38500000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110482653','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:37:17','152','1.215.144.226','2022-11-04 13:41:13'),(390,'KR13','20221104013756','','2022-08-15','221104013756','IN','007','','','KR13S00002',1,35000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110428608','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:37:56','152','1.215.144.226','2022-11-04 13:41:24'),(391,'KR13','20221104013824','','2022-08-16','221104013824','IN','007','','','KR13S00003',1,35000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110481818','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:38:24','152','1.215.144.226','2022-11-04 13:41:33'),(392,'KR13','20221104013858','','2022-09-01','221104013858','IN','007','','','KR13S00004',1,29000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110462240','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:38:58','152','1.215.144.226','2022-11-04 13:41:43'),(393,'KR13','20221104013922','','2022-09-06','221104013922','IN','007','','','KR13S00005',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110459939','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:39:22','152','1.215.144.226','2022-11-04 13:41:51'),(394,'KR13','20221104013950','','2022-09-06','221104013950','IN','007','','','KR13S00006',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110451260','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:39:50','152','1.215.144.226','2022-11-04 13:41:57'),(395,'KR13','20221104014008','','2022-09-06','221104014008','IN','007','','','KR13S00007',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110460824','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:40:08','152','1.215.144.226','2022-11-04 13:42:11'),(396,'KR13','20221104014021','','2022-09-06','221104014021','IN','007','','','KR13S00008',1,29000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110412390','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:40:21','152','1.215.144.226','2022-11-04 13:42:15'),(397,'KR13','20220912014310','','2022-09-12','221104014310','IN','007','','','KR13S00010',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110448645','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:43:10','','',NULL),(398,'KR13','20220912014325','','2022-09-12','221104014325','IN','007','','','KR13S00011',1,38500000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110413429','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:43:25','','',NULL),(399,'KR13','20220912014335','','2022-09-12','221104014335','IN','007','','','KR13S00012',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022110462279','N','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:43:35','','',NULL),(400,'KR13','20220901014424','','2022-08-31','221104013717','OUT','002','2022110474541','20221104745410001','KR13S00013',1,38500000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-09-01 13:48:07','2022110482653','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:44:24','152','121.156.13.66','2022-12-01 18:50:26'),(401,'KR13','20221008014505','','2022-10-08','221104013756','OUT','002','2022110415487','20221104154870001','KR13S00002',1,35000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-10-08 13:48:07','2022110428608','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:45:05','152','1.215.144.226','2022-11-04 13:48:07'),(402,'KR13','20221009014521','','2022-10-09','221104013824','OUT','002','2022110467214','20221104672140001','KR13S00003',1,35000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-10-09 11:00:01','2022110481818','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:45:21','152','1.215.144.226','2022-11-04 13:48:07'),(403,'KR13','20221025014535','','2022-10-25','221104013858','OUT','002','2022110462968','20221104629680001','KR13S00004',1,29000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-10-25 13:48:07','2022110462240','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:45:35','152','1.215.144.226','2022-11-04 13:48:07'),(404,'KR13','20221030014549','','2022-10-30','221104013922','OUT','002','2022110481923','20221104819230001','KR13S00005',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-10-30 13:25:15','2022110459939','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:45:49','152','1.215.144.226','2022-11-04 13:48:07'),(405,'KR13','20221030014604','','2022-10-30','221104013950','OUT','002','2022110487831','20221104878310001','KR13S00006',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-10-30 13:48:07','2022110451260','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:46:04','152','1.215.144.226','2022-11-04 13:48:07'),(406,'KR13','20221030014615','','2022-10-30','221104014008','OUT','002','2022110487831','20221104878310002','KR13S00007',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-10-30 15:30:12','2022110460824','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:46:15','152','1.215.144.226','2022-11-04 13:48:07'),(407,'KR13','20221030014625','','2022-10-30','221104014021','OUT','002','2022110487831','20221104878310003','KR13S00008',1,29000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-10-30 13:48:07','2022110412390','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:46:25','152','1.215.144.226','2022-11-04 13:48:07'),(408,'KR13','20221105014642','','2022-11-05','221104014310','OUT','002','2022110441347','20221104413470001','KR13S00010',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-11-05 12:25:03','2022110448645','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:46:42','152','1.215.144.226','2022-11-04 13:48:07'),(409,'KR13','20221105014737','','2022-11-05','221104014325','OUT','002','2022110441347','20221104413470002','KR13S00011',1,38500000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-11-05 13:48:07','2022110413429','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:47:37','152','1.215.144.226','2022-11-04 13:48:07'),(410,'KR13','20221105014745','','2022-11-05','221104014335','OUT','002','2022110441347','20221104413470003','KR13S00012',1,40000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-11-05 13:50:05','2022110462279','N','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:47:45','152','1.215.144.226','2022-11-04 13:48:07'),(412,'KR13','20221202012920','','2022-12-02','221202012920','IN','007','','','KR13S00009',1,35000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','002',NULL,'2022120296798','N','','N','Y','N','','','','152','1.215.144.226','2022-12-02 13:29:20','','',NULL),(413,'KR13','20221202012936','','2022-09-12','221202012920','OUT','002','2022110433654','20221104336540001','KR13S00009',1,35000000,0,'Y','{\"size\":\"1\",\"unit\":\"005\"}','','006','2022-09-13 13:44:52','2022120296798','N','','Y','Y','N','','','','152','1.215.144.226','2022-12-02 13:29:36','152','121.156.13.66','2022-12-02 13:44:52'),(414,'KR13','20231215060151','','2023-12-15','231215060151','IN','001','2023121578740','2023121578740001','KR13S00018',1,10000,1000,'N','{\"size\":\"123123\",\"unit\":\"005\"}','','002',NULL,'2023121527332','N','','N','Y','N','','','','152','211.54.148.249','2023-12-15 18:01:51','','',NULL),(415,'KR13','20231219053340','','2023-12-19','231219053340','IN','001','2023121911765','2023121911765001','KR13B00015',1,10000,1000,'N','{\"size\":\"250\",\"unit\":\"018\"}','','002',NULL,'2023121937120','N','','N','Y','N','','','','152','211.54.148.249','2023-12-19 17:33:40','','',NULL),(416,'KR13','20231220023630','','2023-12-20','231219053340','IN','001','2023122077905','2023122077905001','KR13B00015',1,10000,1000,'N','{\"size\":\"250\",\"unit\":\"018\"}','','002',NULL,'2023122051493','N','','N','Y','N','','','','152','211.54.148.249','2023-12-20 14:36:30','','',NULL),(417,'KR13','20231222011448','','2023-12-22','231222011448','IN','007','','','KR13B00015',10,10000,0,'Y','{\"size\":\"250\",\"unit\":\"018\"}','','002',NULL,'2023122296394','N','','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:14:48','','',NULL),(418,'KR13','20231222011742','','2023-12-22','231222011742','IN','001','2023122266697','2023122266697001','KR13B00016',3,10000,1000,'N','{\"size\":\"400\",\"unit\":\"018\"}','','002',NULL,'2023122265032','N','','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:17:42','','',NULL);
/*!40000 ALTER TABLE `stock_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `used_history`
--

DROP TABLE IF EXISTS `used_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `used_history` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(10) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `job_no` varchar(20) NOT NULL DEFAULT '' COMMENT '제조 오더 번호 (job_master.job_no)',
  `lot` varchar(20) NOT NULL DEFAULT '' COMMENT '작업 로트 번호 (job_detail.lot)',
  `pp_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '공정 고유 코드 (job_detail.pp_uc)',
  `nu_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '비가동 고유 코드 (not_used.nu_uc)',
  `use_no` varchar(20) NOT NULL DEFAULT '' COMMENT '비가동 작업번호 (yyyyMMddhhss)',
  `start_dt` datetime DEFAULT NULL COMMENT '비가동 시작일시',
  `end_dt` datetime DEFAULT NULL COMMENT '비가동 종료일시',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제유무 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `use_no` (`use_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공정별 비가동 히스토리 관리 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `used_history`
--

LOCK TABLES `used_history` WRITE;
/*!40000 ALTER TABLE `used_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `used_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_log`
--

DROP TABLE IF EXISTS `user_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_log` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `rec_gb` char(1) NOT NULL DEFAULT 'F' COMMENT '사용처 구분 (F: 공장 / C: 센터)',
  `uc_cd` varchar(20) NOT NULL COMMENT '공장 코드 or 센터 코드',
  `uc_nm` varchar(20) NOT NULL COMMENT '공장 이름 or 센터 이름',
  `ul_uc` varchar(20) NOT NULL COMMENT '사원 고유 코드 (공장 or 센터)',
  `ul_id` varchar(20) NOT NULL COMMENT '사원 id (공장 or 센터)',
  `ul_nm` varchar(20) NOT NULL COMMENT '사원 이름 (공장 or 센터)',
  `ul_gb` varchar(10) NOT NULL DEFAULT '' COMMENT '로그 구분 (DA/050)',
  `crud` enum('L','O','C','R','U','D') NOT NULL DEFAULT 'L' COMMENT '활동 구분(L: 로그인, O: 로그 아웃, C: 등록, R: 조회, U: 수정, D: 삭제)',
  `acc_gb` enum('P','A') NOT NULL DEFAULT 'P' COMMENT '접속 유형(P: PC, A: APP)',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고3',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2280 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공장/센터 사용자 로그 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_log`
--

LOCK TABLES `user_log` WRITE;
/*!40000 ALTER TABLE `user_log` DISABLE KEYS */;
INSERT INTO `user_log` VALUES (2146,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-18 14:23:13','','','2022-10-18 14:23:13'),(2147,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-19 11:28:10','','','2022-10-19 11:28:10'),(2148,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-19 17:06:39','','','2022-10-19 17:06:39'),(2149,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-20 09:08:52','','','2022-10-20 09:08:52'),(2150,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-20 10:07:04','','','2022-10-20 10:07:04'),(2151,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-20 10:46:38','','','2022-10-20 10:46:38'),(2152,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','106.240.91.178','2022-10-20 13:28:29','','','2022-10-20 13:28:29'),(2153,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-20 13:57:53','','','2022-10-20 13:57:53'),(2154,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-20 14:07:23','','','2022-10-20 14:07:23'),(2155,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-21 09:17:16','','','2022-10-21 09:17:16'),(2156,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2022-10-21 14:40:04','','','2022-10-21 14:40:04'),(2157,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','106.240.91.178','2022-10-21 17:42:45','','','2022-10-21 17:42:45'),(2158,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-25 08:57:31','','','2022-10-25 08:57:31'),(2159,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-10-27 10:12:26','','','2022-10-27 10:12:26'),(2160,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-03 17:31:17','','','2022-11-03 17:31:17'),(2161,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-04 13:08:10','','','2022-11-04 13:08:10'),(2162,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-04 15:56:47','','','2022-11-04 15:56:47'),(2163,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2022-11-04 19:04:22','','','2022-11-04 19:04:22'),(2164,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-10 14:07:02','','','2022-11-10 14:07:02'),(2165,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:02:11','','','2022-11-11 09:02:11'),(2166,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-14 13:01:54','','','2022-11-14 13:01:54'),(2167,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-14 13:03:59','','','2022-11-14 13:03:59'),(2168,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-14 14:20:36','','','2022-11-14 14:20:36'),(2169,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-14 14:22:16','','','2022-11-14 14:22:16'),(2170,'F','KR13','3d-space','KR13-UL-02','sys','관리자','001','L','P','','N','Y','N','','','','160','1.215.144.226','2022-11-14 14:22:52','','','2022-11-14 14:22:52'),(2171,'F','KR14','금강정밀','KR14-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','153','1.215.144.226','2022-11-14 14:23:29','','','2022-11-14 14:23:29'),(2172,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-15 11:07:32','','','2022-11-15 11:07:32'),(2173,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-15 11:09:55','','','2022-11-15 11:09:55'),(2174,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-15 13:39:34','','','2022-11-15 13:39:34'),(2175,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','121.156.13.66','2022-11-15 14:36:09','','','2022-11-15 14:36:09'),(2176,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-16 10:47:46','','','2022-11-16 10:47:46'),(2177,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','121.156.13.66','2022-11-16 10:49:03','','','2022-11-16 10:49:03'),(2178,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','121.156.13.66','2022-11-16 11:52:47','','','2022-11-16 11:52:47'),(2179,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','121.156.13.66','2022-11-16 11:56:10','','','2022-11-16 11:56:10'),(2180,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','121.156.13.66','2022-11-16 13:45:35','','','2022-11-16 13:45:35'),(2181,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','121.156.13.66','2022-11-26 16:36:27','','','2022-11-26 16:36:27'),(2182,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-28 17:05:42','','','2022-11-28 17:05:42'),(2183,'F','KR14','금강정밀','KR14-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','153','1.215.144.226','2022-11-29 17:57:26','','','2022-11-29 17:57:26'),(2184,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-30 09:52:28','','','2022-11-30 09:52:28'),(2185,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-11-30 17:12:26','','','2022-11-30 17:12:26'),(2186,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-12-01 15:43:48','','','2022-12-01 15:43:48'),(2187,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','121.156.13.66','2022-12-01 18:31:52','','','2022-12-01 18:31:52'),(2188,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','121.156.13.66','2022-12-02 11:42:21','','','2022-12-02 11:42:21'),(2189,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-12-02 11:49:21','','','2022-12-02 11:49:21'),(2190,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','1.215.144.226','2022-12-08 13:06:09','','','2022-12-08 13:06:09'),(2191,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','106.101.2.129','2023-03-08 14:46:33','','','2023-03-08 14:46:33'),(2192,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.197.126.48','2023-04-28 12:42:33','','','2023-04-28 12:42:33'),(2193,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','112.145.146.15','2023-05-19 13:26:26','','','2023-05-19 13:26:26'),(2194,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','112.145.146.45','2023-12-08 18:56:14','','','2023-12-08 18:56:14'),(2195,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','112.145.146.45','2023-12-11 15:17:16','','','2023-12-11 15:17:16'),(2196,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-12 16:53:10','','','2023-12-12 16:53:10'),(2197,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-12 16:59:03','','','2023-12-12 16:59:03'),(2198,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-13 13:57:59','','','2023-12-13 13:57:59'),(2199,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-13 14:09:22','','','2023-12-13 14:09:22'),(2200,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-14 10:23:34','','','2023-12-14 10:23:34'),(2201,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-14 11:36:32','','','2023-12-14 11:36:32'),(2202,'F','KR13','3d-space','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-14 13:39:33','','','2023-12-14 13:39:33'),(2203,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-15 17:00:21','','','2023-12-15 17:00:21'),(2204,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-15 17:00:55','','','2023-12-15 17:00:55'),(2205,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-16 11:45:09','','','2023-12-16 11:45:09'),(2206,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-16 19:34:01','','','2023-12-16 19:34:01'),(2207,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','221.152.160.85','2023-12-17 14:56:07','','','2023-12-17 14:56:07'),(2208,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-18 09:08:35','','','2023-12-18 09:08:35'),(2209,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-18 11:33:09','','','2023-12-18 11:33:09'),(2210,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-18 11:34:09','','','2023-12-18 11:34:09'),(2211,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-18 11:39:03','','','2023-12-18 11:39:03'),(2212,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-18 11:40:12','','','2023-12-18 11:40:12'),(2213,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-18 16:03:38','','','2023-12-18 16:03:38'),(2214,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-20 14:23:57','','','2023-12-20 14:23:57'),(2215,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-20 14:30:04','','','2023-12-20 14:30:04'),(2216,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-21 10:59:01','','','2023-12-21 10:59:01'),(2217,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','39.7.231.169','2023-12-22 09:31:25','','','2023-12-22 09:31:25'),(2218,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-22 13:12:50','','','2023-12-22 13:12:50'),(2219,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-27 10:42:58','','','2023-12-27 10:42:58'),(2220,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-27 13:51:32','','','2023-12-27 13:51:32'),(2221,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-27 17:36:51','','','2023-12-27 17:36:51'),(2222,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2023-12-28 10:41:07','','','2023-12-28 10:41:07'),(2223,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','180.66.225.82','2023-12-28 10:44:52','','','2023-12-28 10:44:52'),(2224,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-01-02 16:30:18','','','2024-01-02 16:30:18'),(2225,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-01-04 09:32:13','','','2024-01-04 09:32:13'),(2226,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','182.31.94.100','2024-01-05 09:56:17','','','2024-01-05 09:56:17'),(2227,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','182.31.94.100','2024-01-05 11:08:23','','','2024-01-05 11:08:23'),(2228,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','182.31.94.100','2024-01-05 11:09:16','','','2024-01-05 11:09:16'),(2229,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-01-17 15:39:21','','','2024-01-17 15:39:21'),(2230,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-02-26 13:05:57','','','2024-02-26 13:05:57'),(2231,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-04 17:05:33','','','2024-03-04 17:05:33'),(2232,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-05 13:05:37','','','2024-03-05 13:05:37'),(2233,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-06 11:47:19','','','2024-03-06 11:47:19'),(2234,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-08 12:05:15','','','2024-03-08 12:05:15'),(2235,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-11 16:28:07','','','2024-03-11 16:28:07'),(2236,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-13 12:20:53','','','2024-03-13 12:20:53'),(2237,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-15 01:14:53','','','2024-03-15 01:14:53'),(2238,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-18 02:03:12','','','2024-03-18 02:03:12'),(2239,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-19 11:57:39','','','2024-03-19 11:57:39'),(2240,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-21 11:33:08','','','2024-03-21 11:33:08'),(2241,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-25 15:42:37','','','2024-03-25 15:42:37'),(2242,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-26 15:42:42','','','2024-03-26 15:42:42'),(2243,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-27 19:38:36','','','2024-03-27 19:38:36'),(2244,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-28 13:50:32','','','2024-03-28 13:50:32'),(2245,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-03-29 10:04:21','','','2024-03-29 10:04:21'),(2246,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-01 11:06:13','','','2024-04-01 11:06:13'),(2247,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-02 19:07:09','','','2024-04-02 19:07:09'),(2248,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-04 12:05:15','','','2024-04-04 12:05:15'),(2249,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-08 01:03:21','','','2024-04-08 01:03:21'),(2250,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-09 17:39:28','','','2024-04-09 17:39:28'),(2251,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-12 10:54:29','','','2024-04-12 10:54:29'),(2252,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-16 13:33:08','','','2024-04-16 13:33:08'),(2253,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-18 01:59:26','','','2024-04-18 01:59:26'),(2254,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-22 01:02:19','','','2024-04-22 01:02:19'),(2255,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-23 11:27:32','','','2024-04-23 11:27:32'),(2256,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-25 00:24:17','','','2024-04-25 00:24:17'),(2257,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','106.101.2.108','2024-04-25 10:25:34','','','2024-04-25 10:25:34'),(2258,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','106.101.2.108','2024-04-25 10:52:33','','','2024-04-25 10:52:33'),(2259,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-26 12:23:06','','','2024-04-26 12:23:06'),(2260,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-04-30 00:48:46','','','2024-04-30 00:48:46'),(2261,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.198.166.243','2024-05-02 19:11:36','','','2024-05-02 19:11:36'),(2262,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-06-26 15:11:09','','','2024-06-26 15:11:09'),(2263,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','106.101.131.70','2024-07-02 14:03:13','','','2024-07-02 14:03:13'),(2264,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-07-23 09:51:27','','','2024-07-23 09:51:27'),(2265,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-07-24 09:26:33','','','2024-07-24 09:26:33'),(2266,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-07-25 11:46:54','','','2024-07-25 11:46:54'),(2267,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-07-30 10:00:37','','','2024-07-30 10:00:37'),(2268,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-07-31 11:21:22','','','2024-07-31 11:21:22'),(2269,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-01 13:34:17','','','2024-08-01 13:34:17'),(2270,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-05 10:22:07','','','2024-08-05 10:22:07'),(2271,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-06 09:12:34','','','2024-08-06 09:12:34'),(2272,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-08 10:04:30','','','2024-08-08 10:04:30'),(2273,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-13 09:11:02','','','2024-08-13 09:11:02'),(2274,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-19 13:20:49','','','2024-08-19 13:20:49'),(2275,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-21 09:35:43','','','2024-08-21 09:35:43'),(2276,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-23 13:50:44','','','2024-08-23 13:50:44'),(2277,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','211.54.148.249','2024-08-26 11:12:18','','','2024-08-26 11:12:18'),(2278,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','119.207.182.156','2024-08-27 21:18:32','','','2024-08-27 21:18:32'),(2279,'F','KR13','DroneWorld','KR13-UL-01','admin','관리자','001','L','P','','N','Y','N','','','','152','222.97.255.112','2024-08-27 21:26:15','','','2024-08-27 21:26:15');
/*!40000 ALTER TABLE `user_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `main_cd` varchar(50) NOT NULL DEFAULT 'WH' COMMENT '메인 코드',
  `wh_seq` varchar(50) NOT NULL DEFAULT '01' COMMENT '창고 코드순번',
  `wh_uc` varchar(50) NOT NULL COMMENT '창고 고유 코드(공장코드-메인코드-창고 코드순번 조합)',
  `wh_cd` varchar(50) NOT NULL DEFAULT 'WH10' COMMENT '창고 코드',
  `wh_gb` varchar(50) NOT NULL DEFAULT '' COMMENT '창고 유형',
  `wh_no` varchar(5) NOT NULL DEFAULT '1' COMMENT '창고 정렬순서',
  `wh_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '창고명',
  `person` varchar(100) NOT NULL DEFAULT '' COMMENT '담당자',
  `tel` varchar(100) NOT NULL DEFAULT '' COMMENT '창고 전화번호(숫자, 하이픈 입력가능)',
  `post_code` varchar(100) NOT NULL DEFAULT '' COMMENT '우편번호',
  `addr` varchar(255) NOT NULL DEFAULT '' COMMENT '창고 주소',
  `addr_detail` varchar(255) NOT NULL DEFAULT '' COMMENT '창고 상세주소',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능) (사용안함)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_wh_seq` (`local_cd`,`main_cd`,`wh_seq`),
  UNIQUE KEY `wh_uc` (`wh_uc`),
  UNIQUE KEY `local_cd_wh_nm` (`local_cd`,`wh_nm`)
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='공장별 창고 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse`
--

LOCK TABLES `warehouse` WRITE;
/*!40000 ALTER TABLE `warehouse` DISABLE KEYS */;
INSERT INTO `warehouse` VALUES (308,'KR13','WH','01','KR13-WH-01','WH10','001','1','창고1','','','','','','','Y','Y','N','','','','152','1.215.144.226','2022-11-04 13:31:42','152','211.54.148.249','2023-12-22 13:14:48');
/*!40000 ALTER TABLE `warehouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `water_gauge`
--

DROP TABLE IF EXISTS `water_gauge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `water_gauge` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `base_dt` date DEFAULT NULL COMMENT '기준일',
  `volume` decimal(18,2) DEFAULT 0.00 COMMENT '사용량',
  `unit` varchar(5) DEFAULT '' COMMENT '단위(BA/060)',
  `memo` mediumtext DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참고3',
  `reg_ikey` varchar(20) DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일자',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일자',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_base_dt` (`local_cd`,`base_dt`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='수도계량 관리 테이블 (식품군 사용/리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `water_gauge`
--

LOCK TABLES `water_gauge` WRITE;
/*!40000 ALTER TABLE `water_gauge` DISABLE KEYS */;
/*!40000 ALTER TABLE `water_gauge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_history`
--

DROP TABLE IF EXISTS `work_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `work_history` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(10) NOT NULL COMMENT '공장 코드 (z_plan.factory)',
  `wh_no` varchar(15) NOT NULL DEFAULT '' COMMENT '실적 작업번호 (yyyyMMddhhss)',
  `job_no` varchar(20) NOT NULL DEFAULT '' COMMENT '제조 오더 번호 (job_master.job_no)',
  `lot` varchar(20) NOT NULL DEFAULT '' COMMENT '작업 로트 번호 (job_detail.lot)',
  `pp_uc` varchar(20) NOT NULL DEFAULT '' COMMENT '공정 고유 코드 (job_detail.pp_uc)',
  `qty` int(11) DEFAULT 0 COMMENT '실적 수량',
  `flaw_qty` int(11) DEFAULT 0 COMMENT '불량 수량',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `wh_no` (`wh_no`)
) ENGINE=InnoDB AUTO_INCREMENT=420 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='공정별 작업 실적 관리 테이블 (리뉴얼 완료)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_history`
--

LOCK TABLES `work_history` WRITE;
/*!40000 ALTER TABLE `work_history` DISABLE KEYS */;
INSERT INTO `work_history` VALUES (337,'KR13','1','2023121447956','2023121447956001','KR13-PP-02',2,0,'152','','2023-12-14 14:28:02','','',NULL),(338,'KR13','2','5158D118','5158D118001','KR13-PP-02',1,0,'152','','2023-12-15 16:48:21','','',NULL),(339,'KR13','3','','001','KR13-PP-02',5,0,'152','','2023-12-18 09:22:35','','',NULL),(340,'KR13','4','01233','01233001','KR13-PP-02',1,0,'152','','2023-12-18 17:08:09','','',NULL),(341,'KR13','5','012222','012222001','KR13-PP-02',1,0,'152','','2023-12-18 17:09:14','','',NULL),(342,'KR13','6','46231','46231001','KR13-PP-02',1,0,'152','','2023-12-20 14:41:25','','',NULL),(343,'KR13','7','4455','4455001','KR13-PP-02',0,0,'152','','2023-12-20 14:41:25','','',NULL),(344,'KR13','8','12220118','12220118001','KR13-PP-03',1,0,'152','','2023-12-22 13:20:19','','',NULL),(345,'KR13','9','DW1226','DW1226001','KR13-PP-02',45,0,'152','','2023-12-27 10:54:58','','',NULL),(346,'KR13','10','DW1222','DW1222001','KR13-PP-02',42,0,'152','','2023-12-27 10:54:58','','',NULL),(354,'KR13','11','DW1214','DW1214001','KR13-PP-03',35,0,'152','','2023-12-27 11:20:35','','',NULL),(355,'KR13','12','DW1217','DW1217001','KR13-PP-02',32,0,'152','','2023-12-27 11:20:35','','',NULL),(356,'KR13','13','HD20231229','HD20231229001','KR13-PP-03',15,0,'152','','2024-01-02 17:42:08','','',NULL),(357,'KR13','14','HD20231218','HD20231218001','KR13-PP-03',15,0,'152','','2024-01-02 17:42:08','','',NULL),(358,'KR13','15','HD20240102','HD20240102001','KR13-PP-03',30,0,'152','','2024-01-02 17:46:04','','',NULL),(359,'KR13','16','HD20240304','HD20240304001','KR13-PP-03',31,0,'152','','2024-03-04 17:19:15','','',NULL),(360,'KR13','17','HD20240229','HD20240229001','KR13-PP-03',25,0,'152','','2024-03-04 17:19:33','','',NULL),(361,'KR13','18','HD20240228','HD20240228001','KR13-PP-03',19,0,'152','','2024-03-04 17:19:33','','',NULL),(362,'KR13','19','HD20240227','HD20240227001','KR13-PP-03',23,0,'152','','2024-03-04 17:19:33','','',NULL),(363,'KR13','20','HD20240226','HD20240226001','KR13-PP-03',30,0,'152','','2024-03-04 17:19:33','','',NULL),(364,'KR13','21','HD20240305','HD20240305001','KR13-PP-03',29,0,'152','','2024-03-05 13:06:27','','',NULL),(365,'KR13','22','HD20240306','HD20240306001','KR13-PP-03',25,0,'152','','2024-03-06 11:48:01','','',NULL),(366,'KR13','23','HD20240308','HD20240308001','KR13-PP-03',34,0,'152','','2024-03-08 12:06:26','','',NULL),(367,'KR13','24','HD20240307','HD20240307001','KR13-PP-03',28,0,'152','','2024-03-08 12:06:26','','',NULL),(368,'KR13','25','HD20240311','HD20240311001','KR13-PP-03',34,1,'152','','2024-03-11 18:12:13','','',NULL),(371,'KR13','','HD20240312','HD20240312001','KR13-PP-03',28,3,'152','','2024-03-12 11:47:09','','',NULL),(372,'KR13','26','HD20240313','HD20240313001','KR13-PP-03',25,0,'152','','2024-03-13 12:21:44','','',NULL),(373,'KR13','27','HD20240315','HD20240315001','KR13-PP-03',24,0,'152','','2024-03-15 01:16:29','','',NULL),(374,'KR13','28','HD20240314','HD20240314001','KR13-PP-03',30,0,'152','','2024-03-15 01:16:29','','',NULL),(375,'KR13','29','HD20240318','HD20240318001','KR13-PP-03',25,0,'152','','2024-03-18 02:03:52','','',NULL),(376,'KR13','30','HD20240319','HD20240319001','KR13-PP-03',30,0,'152','','2024-03-19 11:58:21','','',NULL),(377,'KR13','31','HD20240320','HD20240320001','KR13-PP-03',32,0,'152','','2024-03-20 00:28:46','','',NULL),(378,'KR13','32','HD20240321','HD20240321001','KR13-PP-03',28,0,'152','','2024-03-21 11:33:54','','',NULL),(379,'KR13','33','HD20240325','HD20240325001','KR13-PP-03',25,0,'152','','2024-03-25 15:44:04','','',NULL),(380,'KR13','34','HD20240322','HD20240322001','KR13-PP-03',25,0,'152','','2024-03-25 15:44:04','','',NULL),(381,'KR13','35','HD20240326','HD20240326001','KR13-PP-03',20,0,'152','','2024-03-26 15:43:28','','',NULL),(382,'KR13','36','HD20240327','HD20240327001','KR13-PP-03',23,0,'152','','2024-03-27 19:39:09','','',NULL),(383,'KR13','37','HD20240328','HD20240328001','KR13-PP-03',22,0,'152','','2024-03-28 13:51:09','','',NULL),(384,'KR13','38','HD20240329','HD20240329001','KR13-PP-03',23,0,'152','','2024-03-29 10:04:59','','',NULL),(385,'KR13','39','HD20240401','HD20240401001','KR13-PP-03',22,0,'152','','2024-04-01 11:07:08','','',NULL),(386,'KR13','40','HD20240402','HD20240402001','KR13-PP-03',30,0,'152','','2024-04-02 19:07:50','','',NULL),(387,'KR13','41','HD20240404','HD20240404001','KR13-PP-03',38,0,'152','','2024-04-04 12:06:20','','',NULL),(388,'KR13','42','HD20240403','HD20240403001','KR13-PP-03',35,0,'152','','2024-04-04 12:06:20','','',NULL),(389,'KR13','43','HD20240405','HD20240405001','KR13-PP-03',30,0,'152','','2024-04-08 01:03:59','','',NULL),(390,'KR13','44','HD20240408','HD20240408001','KR13-PP-03',37,0,'152','','2024-04-08 01:06:39','','',NULL),(391,'KR13','45','HD20240409','HD20240409001','KR13-PP-03',33,0,'152','','2024-04-09 17:40:02','','',NULL),(392,'KR13','46','HD20240412','HD20240412001','KR13-PP-03',35,0,'152','','2024-04-12 10:58:06','','',NULL),(393,'KR13','47','HD20240411','HD20240411001','KR13-PP-03',33,0,'152','','2024-04-12 10:58:06','','',NULL),(394,'KR13','48','HD20240416','HD20240416001','KR13-PP-03',41,0,'152','','2024-04-16 13:34:17','','',NULL),(395,'KR13','49','HD20240415','HD20240415001','KR13-PP-03',33,0,'152','','2024-04-16 13:34:17','','',NULL),(396,'KR13','50','HD20240418','HD20240418001','KR13-PP-03',39,0,'152','','2024-04-18 02:00:59','','',NULL),(397,'KR13','51','HD20240417','HD20240417001','KR13-PP-03',33,0,'152','','2024-04-18 02:00:59','','',NULL),(398,'KR13','52','HD20240422','HD20240422001','KR13-PP-03',33,0,'152','','2024-04-22 01:03:32','','',NULL),(399,'KR13','53','HD20240419','HD20240419001','KR13-PP-03',39,0,'152','','2024-04-22 01:03:32','','',NULL),(400,'KR13','54','HD20240423','HD20240423001','KR13-PP-03',30,0,'152','','2024-04-23 11:28:04','','',NULL),(401,'KR13','55','HD20240424','HD20240424001','KR13-PP-03',30,0,'152','','2024-04-24 01:53:01','','',NULL),(402,'KR13','56','HD20240425','HD20240425001','KR13-PP-03',31,0,'152','','2024-04-25 00:24:59','','',NULL),(403,'KR13','57','HD20240426','HD20240426001','KR13-PP-03',40,0,'152','','2024-04-26 12:23:41','','',NULL),(404,'KR13','58','HD20240430','HD20240430001','KR13-PP-03',28,0,'152','','2024-04-30 00:49:51','','',NULL),(405,'KR13','59','HD20240429','HD20240429001','KR13-PP-03',30,0,'152','','2024-04-30 00:49:51','','',NULL),(406,'KR13','60','HD20240502','HD20240502001','KR13-PP-03',33,0,'152','','2024-05-02 19:12:27','','',NULL),(407,'KR13','61','HD20240503','HD20240503001','KR13-PP-03',39,0,'152','','2024-05-03 01:14:54','','',NULL),(408,'KR13','62','20240724R','20240724R001','KR13-PP-03',35,0,'152','','2024-07-24 09:28:00','','',NULL),(409,'KR13','63','20240725R','20240725R001','KR13-PP-02',32,0,'152','','2024-07-25 11:50:32','','',NULL),(410,'KR13','64','20240730R','20240730R001','KR13-PP-02',31,0,'152','','2024-07-30 10:01:13','','',NULL),(411,'KR13','65','20240731R','20240731R001','KR13-PP-02',33,0,'152','','2024-07-31 11:21:53','','',NULL),(412,'KR13','66','20240801R','20240801R001','KR13-PP-02',30,0,'152','','2024-08-01 13:34:42','','',NULL),(413,'KR13','67','20240805R','20240805R001','KR13-PP-02',31,0,'152','','2024-08-05 10:22:37','','',NULL),(414,'KR13','68','20240806R','20240806R001','KR13-PP-02',35,0,'152','','2024-08-06 09:13:06','','',NULL),(415,'KR13','69','20240808R','20240808R001','KR13-PP-02',35,0,'152','','2024-08-08 10:04:57','','',NULL),(416,'KR13','70','20240813R','20240813R001','KR13-PP-02',32,0,'152','','2024-08-13 09:11:27','','',NULL),(417,'KR13','71','20240819R','20240819R001','KR13-PP-02',30,0,'152','','2024-08-19 13:21:13','','',NULL),(418,'KR13','72','20240821R','20240821R001','KR13-PP-02',33,0,'152','','2024-08-21 09:36:13','','',NULL),(419,'KR13','73','20240823R','20240823R001','KR13-PP-02',32,0,'152','','2024-08-23 16:31:18','','',NULL);
/*!40000 ALTER TABLE `work_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_place`
--

DROP TABLE IF EXISTS `work_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `work_place` (
  `ikey` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `local_cd` varchar(20) NOT NULL COMMENT '공장 코드',
  `main_cd` varchar(50) NOT NULL DEFAULT 'WP' COMMENT '메인 코드',
  `wp_seq` varchar(50) NOT NULL DEFAULT '01' COMMENT '작업장 코드순번',
  `wp_uc` varchar(50) NOT NULL COMMENT '작업장 고유 코드(공장코드-메인코드-작업장 코드순번 조합)',
  `wp_cd` varchar(50) NOT NULL DEFAULT 'WP10' COMMENT '작업장 코드',
  `wp_gb` varchar(50) NOT NULL DEFAULT '' COMMENT '작업장 유형',
  `wp_no` varchar(5) NOT NULL DEFAULT '1' COMMENT '작업장 정렬순서',
  `wp_nm` varchar(50) NOT NULL DEFAULT '' COMMENT '작업장명',
  `person` varchar(100) NOT NULL DEFAULT '' COMMENT '담당자',
  `tel` varchar(100) NOT NULL DEFAULT '' COMMENT '작업장 전화번호(숫자, 하이픈 입력가능)',
  `post_code` varchar(100) NOT NULL DEFAULT '' COMMENT '우편번호',
  `addr` varchar(255) NOT NULL DEFAULT '' COMMENT '작업장 주소',
  `addr_detail` varchar(255) NOT NULL DEFAULT '' COMMENT '작업장 상세주소',
  `memo` mediumtext NOT NULL DEFAULT '' COMMENT '비고',
  `sysyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '시스템 사용구분 (Y: 시스템에서 삭제불가 / N: 수정, 삭제가능)',
  `useyn` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT '가용여부 (Y:사용가능 / N:사용불가)',
  `delyn` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT '삭제여부 (Y:삭제 / N:사용가능) (사용안함)',
  `etc_1` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조1',
  `etc_2` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조2',
  `etc_3` varchar(1) NOT NULL DEFAULT '' COMMENT '기타 참조3',
  `reg_ikey` varchar(20) NOT NULL DEFAULT '' COMMENT '등록자 IDX',
  `reg_ip` varchar(20) DEFAULT '' COMMENT '등록자 IP',
  `reg_dt` datetime DEFAULT current_timestamp() COMMENT '등록일시',
  `mod_ikey` varchar(20) DEFAULT '' COMMENT '수정자 IDX',
  `mod_ip` varchar(20) DEFAULT '' COMMENT '수정자 IP',
  `mod_dt` datetime DEFAULT NULL COMMENT '수정일시',
  PRIMARY KEY (`ikey`) USING BTREE,
  UNIQUE KEY `local_cd_main_cd_wp_seq` (`local_cd`,`main_cd`,`wp_seq`),
  UNIQUE KEY `wp_uc` (`wp_uc`),
  UNIQUE KEY `local_cd_wp_nm` (`local_cd`,`wp_nm`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='공장별 작업장 관리 테이블 (리뉴얼 완료)\r\n암호화: person, tel, post_code, addr, addr_detail';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_place`
--

LOCK TABLES `work_place` WRITE;
/*!40000 ALTER TABLE `work_place` DISABLE KEYS */;
INSERT INTO `work_place` VALUES (10,'KR13','WP','01','KR13-WP-01','WP10','','1','작업장1','','','','','','','N','Y','N','','','','152','1.215.144.226','2022-11-11 09:22:28','152','211.54.148.249',NULL);
/*!40000 ALTER TABLE `work_place` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-27 22:34:27
