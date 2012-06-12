require "jsduck/aggregator"
require "jsduck/source_file"

describe JsDuck::Aggregator do

  def parse(string)
    agr = JsDuck::Aggregator.new
    agr.aggregate(JsDuck::SourceFile.new(string))
    agr.classify_orphans
    agr.create_global_class
    agr.result
  end

  shared_examples_for "class of orphans" do
    it "results in one class" do
      @classes.length.should == 1
    end

    it "combines members into itself" do
      @classes[0][:members][:method].length.should == 2
    end

    it "preserves the order of members" do
      methods = @classes[0][:members][:method]
      methods[0][:name].should == "foo"
      methods[1][:name].should == "bar"
    end
  end

  describe "class named by orphan members" do
    before do
      @classes = parse(<<-EOS)
        /**
         * @method foo
         * @member MyClass
         */
        /**
         * @method bar
         * @member MyClass
         */
      EOS
    end

    it_should_behave_like "class of orphans"
  end

  describe "orphan members without @member" do
    before do
      @classes = parse(<<-EOS)
        /**
         * @method foo
         */
        /**
         * @method bar
         */
      EOS
    end

    it "results in global class" do
      @classes[0][:name].should == "global"
    end

    it_should_behave_like "class of orphans"
  end
end
