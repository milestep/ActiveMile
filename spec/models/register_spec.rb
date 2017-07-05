require 'rails_helper'

RSpec.describe Register, type: :model do
  context 'validation all' do
    subject { build(:register) }

    describe 'associations' do
      it { should belong_to(:workspace) }
      it { should belong_to(:article) }
      it { should belong_to(:counterparty) }
    end

    context 'validations should' do
      it { should be_valid(:date) }
      it { should be_valid(:value) }
      it { should be_valid(:note) }
      it { should be_valid(:article_id) }
      it { should be_valid(:counterparty_id) }
      it { should be_valid(:workspace_id) }
    end

    context 'validations expect' do
      let(:register) { build(:register) }

      it 'expect be valid' do
        expect(register).to be_valid
      end

      it 'expect require date' do
        register.date = nil
        expect(register).not_to be_valid
        expect(register).to have(1).error_on(:date)
      end

      it 'expect require value' do
        register.value = nil
        expect(register).not_to be_valid
        expect(register).to have(2).errors_on(:value)
      end

      it 'expect require article_id' do
        register.article_id = nil
        expect(register).not_to be_valid
        expect(register).to have(1).error_on(:article_id)
      end

      it 'expect require counterparty_id' do
        register.counterparty_id = nil
        expect(register).to be_valid
        expect(register).not_to have(1).error_on(:counterparty_id)
      end

      it 'expect require workspace_id' do
        register.workspace_id = nil
        expect(register).not_to be_valid
        expect(register).to have(1).error_on(:workspace_id)
      end

      it { should validate_numericality_of(:value) }
    end
  end
end
