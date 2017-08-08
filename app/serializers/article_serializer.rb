class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :type
  belongs_to :workspace
end
