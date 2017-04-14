require 'spec_helper'

RSpec.describe Workspace, type: :model do
  describe 'validations' do
    subject { create(:workspace) }

    context 'valid' do
      it { should validate_presence_of(:title) }
    end
  end
end
