class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :type
=begin
, :created_at, :updated_at
=end
  belongs_to :workspace
end
