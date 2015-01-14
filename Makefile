all: jsx-build

jsx-build:
	jsx ./jsx/ ./jsx-build/

develop:
	jsx -w ./jsx/ ./jsx-build/

clean:
	rm -rf ./jsx-build
