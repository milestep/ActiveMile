task articles_counter_cache: :environment do   
  Article.find_each{ |article| Article.reset_counters(article.id, :registers) } 
end
