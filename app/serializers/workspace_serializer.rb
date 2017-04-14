class WorkspaceSerializer < ActiveModel::Serializer
  attributes :id, :title, :created_at, :updated_at
  has_many   :articles, serializer: ArticleSerializer
end
