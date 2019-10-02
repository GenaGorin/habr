<?php 
require_once ("phpquery/phpQuery/phpQuery.php");

/**
* 
*/
class habr
{
    
    public function parseLastFiveArticles(){
        $articleUrls = $this->getLastFiveArticlesUrl();
        foreach ($articleUrls as $url) {
           $data[] = $this->parseArticle($url);
        }
        return $data;
    }

    private function getLastFiveArticlesUrl() {
        $html = file_get_contents('https://habr.com/ru/all/');
        $document = phpQuery::newDocument($html);
        $hrefs = $document->find('ul.content-list_posts > li.content-list__item_post > article > h2 > a');
        $i =0;
        foreach ($hrefs as $names) {
          $pqLink = pq($names); //pq делает объект phpQuery
          $res[] = $pqLink->attr('href');
          $i++;
          if ($i == 5) {
                break;
          }
        }
        return $res;
    }

    private function parseArticle($url){
        $html = file_get_contents($url);
        $document = phpQuery::newDocument($html);
        $res['title'] = $document->find('article .post__title_full .post__title-text')->html();
        $res['description'] = $document->find('article .post__body_full .js-mediator-article')->html();
        $res['href'] = $url;
        return $res;
    }
}

?>