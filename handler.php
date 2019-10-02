<?php
require_once 'DB/dbconnect.php';
require_once 'habr.php';


$db = new Db();

if ($_POST['method'] == 'render') {
    $onPage = 5;
    $start = (int) $_POST['start'];
    $sql = "SELECT * FROM `articles` ORDER BY `articles`.`id` DESC LIMIT $start, $onPage";// ORDER BY `articles`.`id` DESC";
    $articles = $db->row($sql, $params);

    $sql = "SELECT count(*) AS all_articles FROM `articles`";
    $pages = $db->row($sql, $params);

    $count = $pages[0]["all_articles"];
    $pages = ceil($count / $onPage);
    $articles[0]['pageCount'] = $pages;
    die(json_encode($articles));
}else if($_POST['method'] == 'parse') {
    $habr = new habr;
    $res = $habr->parseLastFiveArticles();
    foreach ($res as $article) {
        $params = [
            'title'=> $article['title'],
            'description'=> $article['description'],
            'href' => $article['href'],
        ];
        $sql = "INSERT INTO articles (title, description, href) VALUES ( :title, :description, :href)";
        $db->query($sql, $params);
    }
    die (json_encode('success'));
}else {
    'hello';
    die();
}

?>