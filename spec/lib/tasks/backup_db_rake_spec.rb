require 'rails_helper'
require 'spec_helper'
require './services/task/backup'

describe 'BackUp' do

  let(:pathDir) { "#{Rails.root}/spec/test_rake" }

  before do
    BackUp.new(pathDir).perform!
  end

  it 'create dump db' do
    expect(File.directory?(pathDir)).to be true
    expect(Dir["#{pathDir}/*.sql"].empty?).to be false
  end

  it 'remove oldest' do
    FileUtils.mkdir_p('spec/test_rake')
    list_name = ['1', '2']
    list_name.each{|name| File.open "#{pathDir}/#{name}.sql", "w"}
    BackUp.new(pathDir).perform!
    expect(Dir["#{pathDir}/*"].length). to be 3
  end

  after do
    FileUtils.rm_r pathDir
  end

end