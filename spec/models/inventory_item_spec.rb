require 'rails_helper'

RSpec.describe InventoryItem, type: :model do
  context 'validation all' do
    subject { build(:inventory_item) }

    context 'validations should be valid' do
      it { should be_valid(:name) }
      it { should be_valid(:date) }
    end
  end
end
