from osbot_utils.utils.Files import file_contents, path_combine

import riskmandate_ai

class Version:

    FILE_NAME_VERSION = 'version'

    def path_code_root(self):
        return riskmandate_ai.path

    def path_version_file(self):
        return path_combine(self.path_code_root(), self.FILE_NAME_VERSION)

    def value(self):
        version = file_contents(self.path_version_file()) or ""
        return version.strip()

version_riskmandate_ai = Version().value()