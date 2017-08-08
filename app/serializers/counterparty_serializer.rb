class CounterpartySerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type
=begin
, :created_at, :updated_at
=end
  belongs_to :workspace
end
