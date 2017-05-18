class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :type, :created_at, :updated_at
  belongs_to :workspace
end
