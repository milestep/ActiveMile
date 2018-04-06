require 'rails_helper'

RSpec.describe InventoryItem, type: :model do
  describe 'validation all' do
    subject { build(:inventory_item) }

    context 'validations should be valid' do
      it { should be_valid(:name) }
      it { should be_valid(:date) }
    end
  end

  describe 'associations' do
    it { should belong_to(:workspace) }
  end
end
