class ReportsSerializer < ActiveModel::Serializer
  attributes :id, :date, :value, :article_id, :counterparty_id, :note, :client_id, :sales_manager_id
end