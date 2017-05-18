require 'rails_helper'

RSpec.describe Article, type: :model do
  context 'validation all' do
    subject { build(:article) }

    context 'validations should' do
      it { should be_valid(:title) }
      it { should be_valid(:type) }
      it { should be_valid(:workspace_id) }
    end

    context 'validation expect' do
      let(:article) { build(:article) }

      it 'expect be valid' do
        expect(article).to be_valid
      end

      it 'expect require title' do
        article.title = nil
        expect(article).not_to be_valid
        expect(article).to have(1).error_on(:title)
      end

      it 'expect require type' do
        article.type = nil
        expect(article).not_to be_valid
        expect(article).to have(1).error_on(:type)
      end

      it 'expect require workspace_id' do
        article.workspace_id = nil
        expect(article).not_to be_valid
        expect(article).to have(1).error_on(:workspace_id)
      end
    end
  end
end
