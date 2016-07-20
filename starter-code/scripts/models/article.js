(function(module) {

// TODO: DONE Derek Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
  function Article (opts) {
    for (key in opts) {
      this[key] = opts[key];
    }
  }

  Article.allArticles = [];

  Article.prototype.toHtml = function(scriptTemplateId) {
    var template = Handlebars.compile($(scriptTemplateId).text());
    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    this.body = marked(this.body);
    return template(this);
  };

  Article.loadAll = function(dataWePassIn) {
    /* NOTE: the original forEach code should be refactored
       using `.map()` -  since what we are trying to accomplish is the
       transformation of one collection into another. */
    Article.allArticles = dataWePassIn.sort(function(a,b) {
      return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    }).map(function(ele) {
      return new Article(ele);
    });
  };

  /* TODO: DONE Derek Refactoring the Article.fetchAll method, it now accepts a parameter
      that will execute once the loading of articles is done. We do this because
      we might want to call other view functions, and not just renderIndexPage();
      Now instead of calling articleView.renderIndexPage(), we can call
      whatever we pass in! */
  Article.fetchAll = function(nextFunction) {
    if (localStorage.hackerIpsum) {
      $.ajax({
        type: 'HEAD',
        url: '/data/hackerIpsum.json',
        success: function(data, message, xhr) {
          var eTag = xhr.getResponseHeader('eTag');
          if (!localStorage.eTag || eTag !== localStorage.eTag) {
            localStorage.eTag = eTag;
            Article.getAll(nextFunction); // DONE: pass 'nextFunction' into Article.getAll();
          } else {
            Article.loadAll(JSON.parse(localStorage.hackerIpsum));
            // DONE: Replace the following line with 'nextFunction' and invoke it!
            nextFunction();
          }
        }
      });
    } else {
      Article.getAll(nextFunction); // DONE: pass 'nextFunction' into getAll();
    }
  };

  Article.getAll = function(nextFunction) {
    $.getJSON('/data/hackerIpsum.json', function(responseData) {
      Article.loadAll(responseData);
      localStorage.hackerIpsum = JSON.stringify(responseData);
      // DONE: invoke nextFunction!
      nextFunction();
    });
  };

  /* TODO: DONE Derek Chain together a `map` and a `reduce` call to get a rough count of
      all words in all articles. */
  Article.numWordsAll = function() {
    return Article.allArticles.map(function(article) {
        //DONE: Grab the word count from each article body.
      return article.body.match(/\w+/g).length;
    }).reduce(function(acc, cur) {
      return acc + cur;
      // TODO: DONE Derek complete this reduce to get a grand total word count
    });
  };

  /* TODO: DONE Kaylyn Chain together a `map` and a `reduce` call to
            produce an array of *unique* author names. */
  Article.allAuthors = function() {
    var authorsNameArray = Article.allArticles.map(function(article) {
      return article.author;
      //need new array of author names, 250 of them, via article.author
      //then reduce the array via indexOf and
      // return array.indexOf(value) === index;
    }).reduce(function(acc, cur){
      if(acc.indexOf(cur) === -1) {
        acc.push(cur);
      }
      return acc;
    },[]);
    return authorsNameArray;

    //return       TODO: DONE Kaylyn map our collection
      //return    TODO: DONE Kaylyn return just the author names

    /* TODO: DONE Kaylyn For our `reduce` that we'll chain here -- since we are trying to
        return an array, we'll need to specify an accumulator type...
        What data type should this accumulator be and where is it placed? */
  };

  Article.numWordsByAuthor = function() {
    /* TODO: Transform each author element into an object with 2 properties:
        One for the author's name, and one for the total number of words across
        the matching articles written by the specified author. */
    return Article.allAuthors().map(function(author) {
      return {
        name: author,
        numWords: Article.allArticles.filter(function(curArticle) {
          return curArticle.author === author;
        //  what do we return here to check for matching authors?
        })
        .map(function(curArticle){
          return curArticle.body.match(/\w+/g).length;
        }) // use .map to return the author's word count for each article's body (hint: regexp!).
        .reduce(function(acc, cur){
          return acc + cur;
        }) // squash this array of numbers into one big number!
      };
    });
  };

  //TODO: attach functions we need to window in this format: module.articleView = articleView;
  module.Article = Article;
})(window);
