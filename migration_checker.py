'''
Check if migration between two Adonis project is same.
'''


import os
import argparse
import sys
import logging
import filecmp

logging.basicConfig(level=logging.INFO)


def check_if_database_dir_exists(this_dir, other_dir) :

	if not os.path.isdir(os.path.join(this_dir, "database")) :
		logging.error("no database dir found in current Adonis project")
		return False

	if not os.path.isdir(os.path.join(other_dir, "database")) :
		logging.error("no database dir found in the referenced project")
		return False

	logging.info("Database dir exist in both projects...")
	return True


def check_migrations(this_dir, other_dir) :



	'''
	Check all, return false in the end
	Also, use has and only has semantic
	'''

	def check_schema_sync(src_dir, target_dir) :
		
		valid = True

		def check_file_is_same(src_file, target_file) :
			return filecmp.cmp(src_file, target_file)

		src_schema_set = set(os.listdir(src_dir))
		target_schema_set = set(os.listdir(target_dir))

		src_target_diff = src_schema_set.difference(target_schema_set)
		target_src_diff = target_schema_set.difference(src_schema_set)

		if len(src_target_diff) != 0 :
			logging.error("source project contains migrations unavailable in the referenced project.")
			logging.error("\n    ".join(src_target_diff))
			valid = False

		if len(target_src_diff) != 0 :
			logging.error("referenced project contains migrations unavailable in the referenced project.")
			logging.error("\n    ".join(target_src_diff))
			valid = False


		# Check intersection hash
		intersection = src_schema_set.intersection(target_schema_set)
		for item in intersection : 
			if not check_file_is_same(os.path.join(src_dir, item), os.path.join(target_dir, item)) :
				logging.error("File " + item + " in migrations/ out of sync")
				valid = False


		if valid :
			logging.info("Schema valid, all sync")

		return valid
		

	src_dir = os.path.join(this_dir, "database", "migrations")
	target_dir = os.path.join(other_dir, "database", "migrations")

	if not os.path.isdir(src_dir) :
		logging.error("no database/migrations folder in current project")
		return False

	if not os.path.isdir(target_dir) :
		logging.error("no database/migrations folder in current project")
		return False

	logging.info("migrations exist in both folder, checking schema sync...")

	check_schema_sync(src_dir, target_dir)


parser = argparse.ArgumentParser()
parser.add_argument("project_dir", help="Path to the other project root directory")


args = parser.parse_args()

this_dir = os.getcwd()
other_dir = args.project_dir

if not check_if_database_dir_exists(this_dir, other_dir) :
	sys.exit()

if not check_migrations(this_dir, other_dir) :
	sys.exit()





