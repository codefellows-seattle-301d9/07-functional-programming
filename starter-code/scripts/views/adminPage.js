articleView.initAdminPage = function() {
  var template = Handlebars.compile($('#author-template').html());
	Article.numWordsByAuthor().forEach(function(stat) {
		$('.author-stats').append(template(stat));
	});
  $('#blog-stats .words').text(Article.numWordsAll());
	$('#blog-stats .articles').text(Article.allArticles.length);
};

Article.fetchAll(articleView.initAdminPage);
