import os
import sys
import pathlib
import logging
import json
import time
import re
from datetime import datetime
import requests
from urllib.parse import urlencode
from datetime import datetime, timedelta, date


def main():

    logging.basicConfig(level="INFO")

    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    esg_path = norn_data_folder_path / 'esg'
    logging.info('all task done')


if __name__ == "__main__":
    main()
