class Api::V1::ArticlesController < Api::V1::BaseController
  expose :article, -> { current_workspace.articles.find(params[:id]) }
  expose :articles, -> {
    current_workspace.articles.order(id: :asc)
  }

  def index
    render_api(articles, :ok, each_serializer: ArticlesSerializer)
  end

  def create
    article = current_workspace.articles.create(article_params)
    render_api(article, :created)
  end

  def update
    article.update(article_params)
    render_api(article, :accepted)
  end

  def destroy
    article.destroy
    render json: { message: I18n.t('articles.destroy.success') }, status: :ok
  end

  private

  def article_params
    params.require(:article).permit(:title, :type)
  end
end
