class WorkspaceSerializer < ActiveModel::Serializer
  attributes :id, :title
  has_many   :articles, serializer: ArticleSerializer
end
