require "rails_helper"

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    context 'valid' do
      it { should validate_presence_of(:email) }
      it { should validate_uniqueness_of(:email) }
    end
  end

  describe 'associations' do
    it { should have_many(:inventory_items) }
  end
end
