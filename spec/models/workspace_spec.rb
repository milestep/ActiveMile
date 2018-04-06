require 'spec_helper'

RSpec.describe Workspace, type: :model do
  describe 'validations' do
    subject { create(:workspace) }

    context 'valid' do
      it { should validate_presence_of(:title) }
    end
  end

  describe 'associations' do
    it { should have_many(:inventory_items) }
  end
end
