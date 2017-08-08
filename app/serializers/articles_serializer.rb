class ArticlesSerializer < ActiveModel::Serializer
  attributes :id, :title, :type
=begin
, :created_at, :updated_at
=end
end
