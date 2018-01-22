#README

Relevant note_1: my development was made with node 8.9.4 and npm 5.6.0;

Relevant note_2: I assumed that the given data is always valid and didn't make any data validator to avoid overcoming too much the expected resolution time;

The development was made according the following actions list:
	Validate inputs existence 		CHECK
	Validate input file existence		CHECK
	Create file read stream			CHECK
	Read file by line			CHECK
	Validate lines content			CHECK
	Create object with lines content	CHECK
	Process valid records to use		CHECK
	Sum calls cost according to costs	CHECK
	Show totalCost with 2 decimal places	CHECK


There are some comments allong the code that I find interesting/relevant for the interpretation.

To run the script it's only required to run *npm run start somefile*
