class Api::V1::ArticlesController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: :index
  expose :articles, -> { Article.order(updated_at: :asc) }
  expose :article

  def index
    render_api(articles, :ok, each_serializer: ArticlesSerializer)
  end

  def create
    article.save
    render_api(article, :created)
  end

  private

  def article_params
    params.require(:article).permit(:title, :type)
  end
end
