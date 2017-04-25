class Api::V1::ArticlesController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: :index

  expose :article
  expose :articles, -> { 
    Workspace.find(params[:workspace_id]).articles.order(id: :asc) 
  }

  def index
    render_api(articles, :ok, each_serializer: ArticlesSerializer)
  end

  def create
    article.save
    render_api(article, :created)
  end

  def update
    article.update(article_params)
    render_api(article, :accepted)
  end

  def destroy
    article.destroy
    render json: { message: "Article has successfully deleted" }, status: :ok
  end

  private

  def article_params
    params.require(:article).permit(:title, :type, :workspace_id)
  end
end
