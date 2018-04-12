class InventoryItemSerializer < ActiveModel::Serializer
  attributes :name, :date, :counterparty_id
end
