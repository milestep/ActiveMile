class CounterpartySerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type, :active
  belongs_to :workspace
end
