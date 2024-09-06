-- Dùng XAMPP start 2 services 
-- Vào localhost/phpmyadmin tương tác db trên GUI
-- cmd tại thư mục xampp/mysql/bin
-- mysql -u root
-- SHOW DATABASES;
CREATE DATABASE blogdatav1;
USE DATABASE blogdatav1;

CREATE TABLE Test(
  test int
);
INSERT INTO Test VALUES(1);
SELECT * FROM Test;

-- MySQL k có nvarchar, chỉ dùng varchar thôi
CREATE TABLE BlogUser(
  id char(36) PRIMARY KEY,
  username varchar(255), 
  password varchar(255),
  avatar varchar(255) DEFAULT '',
  email varchar(255),
  dateofbirth datetime DEFAULT CURRENT_TIMESTAMP,
  gender bit DEFAULT 0, -- 0 là nữ, 1 là nam
  displayname varchar(255),
  emailverified bit DEFAULT 0,
  bio varchar(600) DEFAULT ''
);

CREATE TABLE Blog(
  blogid char(36) PRIMARY KEY,
  category smallint,
  title varchar(255),
  userid char(36),
  content text,
  createdTime datetime,
  heartNum smallint,
  hahaNum smallint,
  publishedAt datetime, -- Chưa publish sẽ để null
  lastModifiedAt datetime,
  parentId char(36), 
  viewNum int,
  meta varchar(255),
  FOREIGN KEY (userid) REFERENCES BlogUser(id)
);

CREATE TABLE Util(
  blogid char(36),
  userid char(36),
  heart bit,
  haha bit,
  FOREIGN KEY (userid) REFERENCES BlogUser(id),
  FOREIGN KEY (blogid) REFERENCES Blog(blogid),
  PRIMARY KEY(blogid, userid)
);

CREATE TABLE Comment(
  id char(36) PRIMARY KEY,
  content text,
  createdTime datetime,
  userid char(36),
  blogid char(36),
  parentid char(36),
  lastModifiedAt datetime,
  FOREIGN KEY (userid) REFERENCES BlogUser(id),
  FOREIGN KEY (blogid) REFERENCES Blog(blogid)
);

-- Blog: blogid, category, title, id user, content, datetime, tổng tim, tổng haha, PublishedAt, LastModifiedAt, mảng id, lượt view, meta
-- Util: blogid, userid, tim (true/false), haha (true/false)
-- Comment: contentn comment, datetime, userid, blogid, order, parentid, LastModifiedAt


