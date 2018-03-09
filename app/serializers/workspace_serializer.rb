class WorkspaceSerializer < ActiveModel::Serializer
  attributes :id, :title, :sales
  has_many   :articles, serializer: ArticleSerializer
end
