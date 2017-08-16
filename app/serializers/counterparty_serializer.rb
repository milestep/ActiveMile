class CounterpartySerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type
  belongs_to :workspace
end
