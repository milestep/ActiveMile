class RegisterSerializer < ActiveModel::Serializer
  attributes :id, :date, :value, :note, :article_id, :counterparty_id, :client_id, :sales_manager_id
  belongs_to :article
  belongs_to :counterparty
  belongs_to :client
  belongs_to :sales_manager
end
