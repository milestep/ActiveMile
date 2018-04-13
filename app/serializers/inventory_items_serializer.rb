class InventoryItemsSerializer < ActiveModel::Serializer
  attributes :name, :date, :id, :counterparty_id
end
