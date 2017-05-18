class CounterpartySerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type, :created_at, :updated_at
  belongs_to :workspace
end
